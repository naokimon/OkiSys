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

    return (
        <Box>
            <Text color={colors.textPrimary}>System Specs</Text>
        </Box>
    )
}

const Dashboard = () => (
    <Box height={process.stdout.rows} width={process.stdout.columns} borderStyle="round" borderColor={colors.brandDark} paddingY={2} paddingX={4}>
        <Box flexGrow={1}>
            <SystemInfo />
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