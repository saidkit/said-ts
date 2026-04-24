// Shared MCP tool result helpers
import type { AppError } from "./errors.js";

export interface McpToolResult {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export function ok(data: unknown): McpToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
}

export function err(e: AppError): McpToolResult {
  return { isError: true, content: [{ type: "text", text: JSON.stringify(e.toJSON()) }] };
}
