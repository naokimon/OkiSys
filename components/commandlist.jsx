import React from 'react';
import { colors } from "../index";
import { Text, Box } from "ink";

export const CommandList = () => {
    return (
        <Box flexDirection="column" paddingY={1} paddingX={2} flexGrow={1}>
            <Box marginBottom={1} borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={colors.border}>
                <Text bold color={colors.brand}>Command List</Text>
            </Box>
            <Box flexDirection="column" gap={1}>
                {[
                    { command: "exit", desc: "Exit the program" },
                    { command: "goto <url>", desc: "Open a URL in your browser" },
                    { command: "search <query>", desc: "Search the query in your browser" },
                    { command: "github <user>", desc: "Open a GitHub user's profile" },
                    { command: "okisys", desc: "Open OkiSys repository on github" },
                    { command: "time", desc: "Get current time" },
                    { command: "clear", desc: "Clear the output" },
                ].map(({ command, desc }) => (
                    <Box key={command} width="100%" justifyContent="space-between" gap={1}>
                        <Text color={colors.muted}>{command}:</Text>
                        <Text color={colors.textPrimary}>{desc}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}