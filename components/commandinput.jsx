import React from 'react';
import { useState, useEffect } from 'react';
import { colors } from "../index";
import TextInput from 'ink-text-input';
import { Text, Box, useInput, useApp } from "ink";
import open from 'open';
import useSize from "../index";
import { writeFileSync, existsSync, appendFileSync, readFileSync } from 'fs';

const runCommand = async (rawCMD) => {
    const i = rawCMD.indexOf(" ");
    const cmd = i === -1 ? rawCMD : rawCMD.slice(0, i).toLowerCase();
    const args = i === -1 ? [] : rawCMD.slice(i + 1).split(" ");

    switch (cmd) {
        case "exit":
            process.exit(0);
        case "goto": {
            if (!args[0]) return ["Usage: goto <url>", colors.error];
            try {
                let url = args[0];
                if (!url.includes("https://")) {
                    url = "https://" + url;
                }
                open(url);
                return [`Trying ${url}`, colors.success];
            } catch (e) {
                return [e.message, colors.error];
            }
        }
        case "github": {
            if (!args[0]) return ["Usage: github <username>", colors.error];
            const username = args[0];
            try {
                const res = await fetch(`https://github.com/${username}`);
                if (res.status === 404) {
                    return [`${username} doesn't exist!`, colors.error];
                } else if (res.status === 200) {
                    open(`https://github.com/${username}`);
                    return [`Opening ${username}'s profile!`, colors.success];
                } else {
                    return [`Error checking GitHub profile (status ${res.status})`, colors.error];
                }
            } catch (e) {
                return [`Network error: ${e.message}`, colors.error];
            }
        }
        case "clear":
            return ['', colors.success, true];
        case "search": {
            if (!args[0]) return ["Usage: search <query>", colors.error];
            const query = args.map(encodeURIComponent).join("+");
            open(`https://www.google.com/search?q=${query}`);
            return ["Searching!", colors.success];
        }
        case "time": {
            const date = new Date();
            const rawHour = date.getHours();
            const hour = rawHour > 12 ? rawHour - 12 : rawHour === 0 ? 12 : rawHour;
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return [`It is now ${hour}:${minutes} ${rawHour >= 12 ? "PM" : "AM"}`, colors.success];
        }
        case "okisys":
            open("https://github.com/naokimon/okisys");
            return [`Opening OkiSys repository!`, colors.success];
        default:
            return [`${cmd} is not a valid command!`, colors.textPrimary];
    }
};

export const CommandInput = () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState();
    const [resultColor, setResultColor] = useState(null);
    const [clear, setClear] = useState(false);
    const [commandList, setCommandList] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        if (existsSync('commandlog.txt')) {
            const lines = readFileSync('commandlog.txt', 'utf-8').split('\n').filter(Boolean);
            setCommandList(lines);
            setHistoryIndex(lines.length);
        }
    }, []);

    const handleSubmit = async () => {
        const rawCMD = value.trim();
        if (!rawCMD) return;

        if (!existsSync("commandlog.txt")) {
            writeFileSync('commandlog.txt', rawCMD);
        } else {
            appendFileSync('commandlog.txt', `\n${rawCMD}`);
        }

        const lines = readFileSync('commandlog.txt', 'utf-8').split('\n').filter(Boolean);
        setCommandList(lines);
        setHistoryIndex(lines.length);

        const result = await runCommand(rawCMD);
        setError(result[0]);
        setResultColor(result[1]);
        if (result[2] != null) {
            setClear(result[2]);
        }
        setValue('');
    };

    useInput((input, key) => {
        if (commandList.length === 0) return;

        if (key.upArrow) {
            const i = Math.max(0, historyIndex - 1);
            setHistoryIndex(i);
            setValue(commandList[i] ?? '');
        } else if (key.downArrow) {
            const i = Math.min(commandList.length - 1, historyIndex + 1);
            setHistoryIndex(i);
            setValue(commandList[i] ?? '');
        }
    });

    const size = useSize();

    return (
        <Box width={size.cols} borderStyle="round" borderColor={colors.border} paddingY={1} paddingX={2} flexDirection="row" gap={2}>
            {error && !clear && <Text color={resultColor}>{error}  |</Text>}
            <TextInput color={colors.textPrimary} placeholderColor={colors.muted} value={value} onChange={(val) => { setValue(val); setHistoryIndex(commandList.length); }} onSubmit={handleSubmit} placeholder="Enter a command..." />
        </Box>
    )
};
