import type { Tool, FilterParams, Categories, ToolsResponse, AgentTool, ContactMessage, InsertContactMessage } from "@shared/schema";
import toolsData from "./data/tools.json";
import categoriesData from "./data/categories.json";
import agentsData from "./data/agents.json";

export interface IStorage {
  getAllTools(filters: FilterParams): Promise<ToolsResponse>;
  getToolBySlug(slug: string): Promise<Tool | undefined>;
  getCategories(): Promise<Categories>;
  searchTools(query: string): Promise<Tool[]>;
  getAllAgents(): Promise<AgentTool[]>;
  addContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private tools: Tool[];
  private categories: Categories;
  private agents: AgentTool[];
  private contactMessages: ContactMessage[];
  private messageIdCounter: number;

  constructor() {
    this.tools = toolsData as Tool[];
    this.categories = categoriesData as Categories;
    this.agents = agentsData as AgentTool[];
    this.contactMessages = [];
    this.messageIdCounter = 1;
  }

  async getAllTools(filters: FilterParams): Promise<ToolsResponse> {
    let filtered = [...this.tools];

    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.short_description.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.primary_category.toLowerCase().includes(searchLower) ||
          tool.secondary_category.toLowerCase().includes(searchLower)
      );
    }

    // Apply pricing filter
    if (filters.pricing && filters.pricing.length > 0) {
      filtered = filtered.filter((tool) =>
        filters.pricing!.includes(tool.pricing)
      );
    }

    // Apply primary category filter
    if (filters.primary_category) {
      filtered = filtered.filter(
        (tool) => tool.primary_category === filters.primary_category
      );
    }

    // Apply secondary category filter
    if (filters.secondary_category) {
      filtered = filtered.filter(
        (tool) => tool.secondary_category === filters.secondary_category
      );
    }

    // Apply platform type filter
    if (filters.platform_type) {
      filtered = filtered.filter(
        (tool) => tool.platform_type === filters.platform_type
      );
    }

    // Calculate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 24;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    // Get paginated results
    const tools = filtered.slice(start, end);

    return {
      tools,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  async getToolBySlug(slug: string): Promise<Tool | undefined> {
    return this.tools.find((tool) => tool.slug === slug);
  }

  async getCategories(): Promise<Categories> {
    return this.categories;
  }

  async searchTools(query: string): Promise<Tool[]> {
    if (!query.trim()) {
      return [];
    }

    const searchLower = query.toLowerCase();
    return this.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.short_description.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower)
    );
  }

  async getAllAgents(): Promise<AgentTool[]> {
    return this.agents;
  }

  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: this.messageIdCounter++,
      ...message,
      createdAt: new Date().toISOString(),
    };
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return this.contactMessages;
  }
}

export const storage = new MemStorage();
