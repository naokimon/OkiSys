import React from 'react';
import { useState, useEffect } from 'react';
import { colors } from "../index";
import { PerformanceInfo } from "./performanceinfo";
import { SystemInfo } from "./systemspecs";
import { Box, Text } from "ink";
import TextInput from 'ink-text-input';

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

export const Dashboard = () => (
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