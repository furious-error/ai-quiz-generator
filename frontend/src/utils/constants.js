// src/utils/constants.js

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// JWT Token Storage Key
export const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY;

// Quiz Generation Limits
export const MIN_QUESTIONS = 5;
export const MAX_QUESTIONS = 20;
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

// Default Values
export const DEFAULT_QUIZ_TOPIC = "General Knowledge";
export const DEFAULT_NUM_QUESTIONS = 5;
export const DEFAULT_DIFFICULTY = "medium";

// Messages
export const RATE_LIMIT_MESSAGE = "Daily AI quiz generation limit exceeded. Please try again tomorrow.";
export const GENERIC_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";