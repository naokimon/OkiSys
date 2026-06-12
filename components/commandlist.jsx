import React from 'react';
import { colors } from "../index";
import { Text, Box } from "ink";
import useSize from "../index";

export const CommandList = () => {
    const size = useSize();

    return (
        <Box flexDirection="column" paddingY={1} paddingX={2}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>Command List</Text>
            </Box>
            <Box flexDirection="column" gap={1}>
                {[
                    { command: "exit", desc: "Exit the program" },
                    { command: "goto <url>", desc: "Open a URL in your browser" },
                    { command: "github <user>", desc: "Open a GitHub user's profile" },
                ].map(({ command, desc }) => (
                    <Box key={command} width="100%" justifyContent="space-between" gap={1}>
                        <Text color={colors.muted}>{command}:</Text>
                        <Box maxWidth={size.cols * 0.1}>
                            <Text color={colors.textPrimary}>{desc}</Text>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}