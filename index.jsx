#!/usr/bin/env node

import React from 'react';
import { useState, useEffect } from 'react';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { render, Box, Text, Newline, Spacer, Static, Transform } from 'ink';
import { useInput, useApp, useStdin, useFocus, useFocusManager } from 'ink';
import os from 'os';

const banner = figlet.textSync('OkiSys', { font: 'ANSI Shadow' });

const colors = {
    brand: '#f05630',
    brandLight: '#ff7a56',
    brandDark: '#b83d1f',

    bg: '#0d0d0d',
    surface: '#1a1a1a',
    border: '#2e2e2e',
    muted: '#565656',

    textPrimary: '#f0ebe6',
    textSecondary: '#a8a09a',

    success: '#4caf7d',
    warning: '#e0a030',
    error: '#e05252',
    info: '#5b9bd5',
};

const StartUp = ({ onDone }) => {
    useInput(() => onDone());
    console.clear();

    return (
        <Box flexDirection="column">
            <Box height={process.stdout.rows * 0.9} width="100%" justifyContent="center" alignItems="center">
                <Box justifyContent="center" alignItems="center" width="50%" flexDirection="column" padding={5} borderStyle="round" borderColor="#f05630">
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

const SystemInfo = () => {
    const cpus = os.cpus();
    const ram = os.totalmem();
    const free = os.freemem();

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2} alignItems="center" width="100%">
            <Text bold color={colors.brandLight}>System Specs</Text>
            <Box height="100%" width="100%" flexDirection="column" justifyContent="space-between" marginTop={1}>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>CPU:</Text>
                    <Text color={colors.textSecondary}>{cpus[0].model}</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>CPU cores:</Text>
                    <Text color={colors.textSecondary}>{cpus.length} cores</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>RAM:</Text>
                    <Text color={colors.textSecondary}>{(ram / 1e9).toFixed(1)} GB total</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>Free space:</Text>
                    <Text color={colors.textSecondary}>{(free / 1e9).toFixed(1)} GB free</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>OS:</Text>
                    <Text color={colors.textSecondary}>{os.type()} {os.release()}</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>Host:</Text>
                    <Text color={colors.textSecondary}>{os.hostname()}</Text>
                </Box>
                <Box width="100%" justifyContent="space-between">
                    <Text color={colors.textPrimary}>Arch:</Text>
                    <Text color={colors.textSecondary}>{os.arch()}</Text>
                </Box>
            </Box>
        </Box>
    )
}

const Dashboard = () => (
    <Box height={process.stdout.rows} width={process.stdout.columns} borderStyle="round" borderColor={colors.brandDark} paddingY={1} paddingX={2}>
        <Box flexGrow={1}>
            <Box height="100%" width="35%" borderStyle="round" borderColor={colors.border}>
                <SystemInfo />
            </Box>
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