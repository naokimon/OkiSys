import React from 'react';
import { colors } from "../index";
import { useState, useEffect } from "react";
import os from "os";
import si from "systeminformation";
import { Box, Text } from "ink";
import useSize from "../index";


export const SystemInfo = () => {
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

    const size = useSize();

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2} minWidth={size.cols * 0.35}>
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
                    { label: "RAM Slots", value: ramInfo ? `${ramInfo.slots} slots used` : "Loading..." },
                    { label: "Storage", value: storage ?? "Loading..." },
                    { label: "OS", value: `${os.type()} ${os.release()}` },
                    { label: "Host", value: os.hostname() },
                    { label: "Arch", value: os.arch() },
                ].map(({ label, value }) => (
                    <Box key={label} width="100%" justifyContent="space-between">
                        <Text color={colors.muted}>{label}:</Text>
                        <Text color={colors.textPrimary}>{value}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};