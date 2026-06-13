import React from 'react';
import { useState, useEffect } from 'react';
import { colors } from "../index";
import { PerformanceInfo } from "./performanceinfo";
import { SystemInfo } from "./systemspecs";
import { Box } from "ink";
import { CommandInput } from './commandinput'
import { CommandList } from './commandlist';
import { NetworkInfo } from './networkinfo';
import useSize from "../index";

const Panel = ({ children }) => (
    <Box flexGrow={1} borderStyle="round" borderColor={colors.border} alignSelf="stretch">
        {children}
    </Box>
);

export const Dashboard = () => {
    const size = useSize();

    return (
        <Box flexDirection="column" height={size.rows} width={size.cols}>
            <Box flexDirection="column" flexGrow={1} gap={1}>
                <Box flexDirection="row" gap={1}>
                    <Panel><SystemInfo /></Panel>
                    <Panel><PerformanceInfo /></Panel>
                    <Panel><CommandList /></Panel>
                </Box>
                <Box flexDirection="row" gap={1} flexGrow={1}>
                    <Panel><NetworkInfo /></Panel>
                </Box>
            </Box>
            <CommandInput />
        </Box>
    )
}