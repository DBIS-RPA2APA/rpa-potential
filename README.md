# Bachelor Experiment: BPMN & LLM

## Project Name

Evaluating Large Language Models in Identifying BPMN Activities for Robotic Process Automation.

## Description

The application uses BPMN visualization, data preprocessing, and the integration of Large Language Models (LLMs) to evaluate the effectiveness of LLMs in identifying and analyzing BPMN activities related to robotic process automation(RPA). The application also includes a chatbot that allows users to discuss the analysis.
This Project involves the implementation of a web-based BPMN editor and a testing environment with an evaluation feature, which were developed as part of a bachelor thesis.

## Features

- Import and export of BPMN (.bpmn / .xml) files
- Visualization and editing of BPMN models
- BPMN preprocessing for LLM input
- Parsing and extraction of BPMN elements
- LLM settings can be configured
- Chat interface for interacting with LLMs
- Analyze different BPMN diagramms to determine which activities are suitable for RPA
- Show BPMN in the editor with highlighted activities, which are suitable for RPA
- Local experimentation environment for evaluating bachelor thesis
- Support of multiple evaluation parameters
- Dynamic visualization of evaluation results such as metrics and LLm settings

## Technologies used

The following technologies were used in this application:

### Frontend

- React
- Vite
- TailwindCSS
- bpmn-js
- bpmn.io
- D3.js
- React Markdown
- react-icons

### Backend

- node-js
- LangChain.js
- OpenRouter
- zod
- DOMParser

## Project goals

- Evaluate the performance of LLMs in terms of how well they can identify RPA-capable BPMN activities
- Development of a interactive web-based platform for LLM and BPMN research
- Visualize and compare the evaluation reuslt of different LLMs across multiple runs

## Quickstart

First create a `.env` file inside the backend folder:

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_BASE_URL=your_base_url (e.g. https://openrouter.ai/api/v1)
DEFAULT_MODEL=your_default_model (optional, e.g. openai/gpt-4o-mini)
```

To use the application, install all the dependencies and then execute the Setup in both the frontend and backend folders.

### Installation

```bash
npm install
```

### Setup

```bash
npm run dev
```

## Project Structure

- `frontend/` -> React application
- `components/` -> Visualization of the components (bpmn, chat, llmSettings,…)
- `services/` -> Backend API Functions
- `ui/` -> Reusable UI and diagram components

- `backend/` -> Backend functions
- `bpmn/` -> BpmnElement extraction
- `data/` -> Datasets for evaluation
- `evaluation/` -> Functions for evaluation and saved evaluation results
- `llm/` -> Functions for connecting to and initiating LLM calls, as well as for chatting with the LLM
- `prompts/` -> User and system prompts for LLM interaction

## Licenses

This project was created for academic reasons.
