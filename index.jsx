#!/usr/bin/env node

import React from 'react';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { render, Box, Text, Newline, Spacer, Static, Transform } from 'ink';
import { useInput, useApp, useStdin, useFocus, useFocusManager } from 'ink';

const banner = figlet.textSync('OkiSys', { font: 'ANSI Shadow' });

const App = () => (
    <Box flexDirection="column">
        <Box height={process.stdout.rows * 0.9} width="100%" justifyContent="center" alignItems="center">
            <Box justifyContent="center" alignItems="center" width="50%" flexDirection="column" padding="5" borderStyle="round" borderColor="#f05630">
                <Text color="#f05630">{banner}</Text>
                <Text dimColor>Built by naokimon</Text>
            </Box>
        </Box>
        <Box height={process.stdout.rows * 0.1} width="100%" borderStyle="double" borderColor="gray">
            
        </Box>
    </Box>
);

console.clear();
render(<App />);