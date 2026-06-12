#!/usr/bin/env node

import React from 'react';
import { useState, useEffect } from 'react';
import chalk from 'chalk';
import figlet from 'figlet';
import { render, Box, Text } from 'ink';
import { useInput } from 'ink';
import { Dashboard } from './components/dashboard';

const banner = figlet.textSync('OkiSys', { font: 'ANSI Shadow' });

export const colors = {
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

export default function useSize()    {
    const [size, setSize] = useState({
        rows: process.stdout.rows,
        cols: process.stdout.columns
    });

    useEffect(() => {
        const onResize = () => setSize({
            rows: process.stdout.rows,
            cols: process.stdout.columns
        });
        process.stdout.on('resize', onResize);
        return () => process.stdout.off('resize', onResize);
    }, []);

    return size;
}

const StartUp = ({ onDone }) => {
    useInput(() => onDone());
    console.clear();

    const size = useSize();

    return (
        <Box flexDirection="column">
            <Box height={size.rows * 0.9} width={size.cols} justifyContent="center" alignItems="center">
                <Box justifyContent="center" alignItems="center" width="50%" flexDirection="column" padding={5} borderStyle="round" borderColor={colors.border}>
                    <Text color={colors.brand}>{banner}</Text>
                    <Text dimColor>Built by naokimon</Text>
                </Box>
            </Box>
            <Box height={size.rows * 0.1} width={size.cols} justifyContent="center">
                <Text dimColor>Press any key to continue...</Text>
            </Box>
        </Box>
    );
};

const App = () => {
    const [screen, setScreen] = useState('startup');

    return screen === 'startup'
        ? <StartUp onDone={() => setScreen('dashboard')} />
        : <Dashboard />;
}

render(<App />);