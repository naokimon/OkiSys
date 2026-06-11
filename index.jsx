#!/usr/bin/env node

import React from 'react';
import { useState, useEffect } from 'react';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { render, Box, Text, Newline, Spacer, Static, Transform } from 'ink';
import { useInput, useApp, useStdin, useFocus, useFocusManager } from 'ink';
import os from 'os';
import si from 'systeminformation';
import TextInput from 'ink-text-input';

const banner = figlet.textSync('OkiSys', { font: 'ANSI Shadow' });

const colors = {
    brand: '#a855f7', // vivid purple
    brandLight: '#c084fc', // light purple
    brandDark: '#7e22ce', // deep purple

    bg: '#0d0d0f',
    surface: '#13111a', // dark purple tint
    border: '#4c1d95', // deep purple border

    muted: '#6b5f7a', // purple-grey

    textPrimary: '#fef08a', // soft yellow
    textSecondary: '#ca8a04', // amber yellow

    success: '#84cc16', // lime green
    warning: '#facc15', // vivid yellow
    error: '#f43f5e', // rose red
    info: '#a78bfa', // soft purple
};

const StartUp = ({ onDone }) => {
    useInput(() => onDone());
    console.clear();

    return (
        <Box flexDirection="column">
            <Box height={process.stdout.rows * 0.9} width="100%" justifyContent="center" alignItems="center">
                <Box justifyContent="center" alignItems="center" width="50%" flexDirection="column" padding={5} borderStyle="round" borderColor={colors.border}>
                    <Text color={colors.brand}>{banner}</Text>
                    <Text dimColor>Built by naokimon</Text>
                </Box>
            </Box>
            <Box height={process.stdout.rows * 0.1} width="100%" justifyContent="center">
                <Text dimColor>Press any key to continue...</Text>
            </Box>
        </Box>
    );
};

function runCommand(cmd) {
    switch (cmd) {
        case "exit":
            console.clear();
            process.exit(0);
            break;
        default:
            break;
    }
}

const CommandInput = () => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        const cmd = value.trim().toLowerCase();
        runCommand(cmd);
        setValue('');
    }

    return (
        <TextInput color={colors.textPrimary} placeholderColor={colors.muted} value={value} onChange={setValue} onSubmit={handleSubmit} placeholder="Enter a command..." />
    )
}

const SystemInfo = () => {
    const cpus = os.cpus();
    const [storage, setStorage] = useState(null);
    const [ramInfo, setRamInfo] = useState(null);
    const [gpu, setGpu] = useState(null);

    useEffect(() => {
        si.graphics().then(data => {
            const controller = data.controllers[0];
            setGpu({
                model: controller.model,
                vram: (controller.vram / 1024).toFixed(1),
                driver: controller.driverVersion === undefined ? "None" : controller.driverVersion,
            }); 
        }, []); // set gpu dict

        si.memLayout().then(mem => {
            setRamInfo({
                memory: (os.freemem() / 1e9).toFixed(1),
                type: mem[0].type,
                speed: mem[0].clockSpeed,
                slots: mem.length
            }); // set ram dict
        }, []);

        si.fsSize().then(drives => {
            const cDrive = drives.find(d => d.fs === "C:");
            setStorage(cDrive ? `${((cDrive.size - cDrive.used) / 1e9).toFixed(1)}/${(cDrive.size / 1e9).toFixed(1)} GB ` : "N/A");
        }); // set storage
    }, []);

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2} minWidth={process.stdout.columns * 0.35}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>System Specs</Text>
            </Box>
            <Box flexDirection="column" gap={1}>
                {[
                    { label: "CPU", value: cpus[0].model },
                    { label: "CPU Cores", value: `${cpus.length} cores` },
                    { label: "GPU", value: gpu?.model ?? "Loading..." },
                    { label: "GPU VRAM", value: `${gpu?.vram} GB` ?? "Loading..." },
                    { label: "GPU Driver", value: `${gpu?.driver}` ?? "Loading..." },
                    { label: "Total RAM", value: `${ramInfo?.memory ?? "Loading..."} GB` },
                    { label: "RAM Type", value: `${ramInfo?.type ?? "Loading..."}` },
                    { label: "RAM Speed", value: ramInfo ? `${ramInfo.speed} MHz` : "Loading..." },
                    { label: "RAM Slots", value: ramInfo ? `${ramInfo.slots} slots used` : "Loading..."},
                    { label: "Storage", value: storage ?? "Loading..." },
                    { label: "OS", value: `${os.type()} ${os.release()}` },
                    { label: "Host", value: os.hostname() },
                    { label: "Arch", value: os.arch() },
                ].map(({ label, value }) => (
                    <Box key={label} width="100%" justifyContent="space-between">
                        <Text color={colors.muted}>{label}</Text>
                        <Text color={colors.textPrimary}>{value}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};

const PerformanceInfo = () => {
    const [ramUsage, setRamUsage] = useState(null);
    const [cpuUsage, setCpuUsage] = useState(null);
    const [gpuUsage, setGpuUsage] = useState(null);


    useEffect(() => {
        const refresh = setInterval(() => {
            si.mem().then(data => {
                if (!data) return;
                setRamUsage((data.used / data.total * 100).toFixed(0));
            });
            si.currentLoad().then(data => setCpuUsage(data.currentLoad.toFixed(1)));
            si.graphics().then(data => setGpuUsage(data.controllers[0].utilizationGpu));
        }, 5000);

        return () => clearInterval(refresh);
    });

    const bar = (pct, width = 10) => {
        const filled = Math.round((pct / 100) * width);
        return "[" + "#".repeat(filled) + "-".repeat(width - filled) + "]";
    }

    const barColor = (pct) => {
        if (pct >= 90) return colors.error;
        if (pct >= 60) return colors.warning;
        return colors.success;
    }

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>Performance Info</Text>
            </Box>
            <Box flexDirection="column" gap={1}>
                <Box flexDirection="column" gap={1}>
                    <Text color={colors.textSecondary}>RAM Usage:</Text>
                    <Box>
                        <Text color={barColor(ramUsage)}>{bar(ramUsage)} {(ramUsage)}%</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const Dashboard = () => (
    <Box flexDirection="column" height={process.stdout.rows} width={process.stdout.columns}>
        <Box flexGrow={1} height={process.stdout.rows / 0.95} paddingY={1} paddingX={2}>
            <Box flexShrink={0} borderStyle="round" borderColor={colors.border} alignSelf="flex-start">
                <SystemInfo />
            </Box>
            <Box flexShrink={0} borderStyle="round" borderColor={colors.border} alignSelf="flex-start">
                <PerformanceInfo />
            </Box>
        </Box>
        <Box height={process.stdout.rows * 0.05} width={process.stdout.columns} borderStyle="round" borderColor={colors.border} paddingY={1.5} paddingX={2}>
            <CommandInput />
        </Box>
    </Box>
)

const App = () => {
    const [screen, setScreen] = useState('startup');

    return screen === 'startup'
        ? <StartUp onDone={() => setScreen('dashboard')} />
        : <Dashboard />;
}

render(<App />);