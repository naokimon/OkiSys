import React from 'react';
import { useState, useEffect } from 'react';
import { colors } from "../index";
import { PerformanceInfo } from "./performanceinfo";
import { SystemInfo } from "./systemspecs";
import { Box } from "ink";
import { CommandInput } from './commandinput'
import useSize from "../index";

export const Dashboard = () => {
    const size = useSize();

    return (
        <Box flexDirection="column" height={size.rows} width={size.cols}>
            <Box flexGrow={1} height={size.rows / 0.95} paddingY={1} paddingX={2}>
                <Box flexShrink={0} borderStyle="round" borderColor={colors.border} alignSelf="flex-start">
                    <SystemInfo />
                </Box>
                <Box flexShrink={0} borderStyle="round" borderColor={colors.border} alignSelf="flex-start">
                    <PerformanceInfo />
                </Box>
            </Box>
            <CommandInput />
        </Box>
    )
}