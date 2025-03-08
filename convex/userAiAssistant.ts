import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const InsertSelectedAssistant = mutation({
  args: {
    records: v.array(v.any()),
    uid: v.optional(v.id("users")), // ✅ Now `uid` is optional
  },
  handler: async (ctx, args) => {
    try {
      if (!args.uid) {
        throw new Error("User ID (uid) is required to insert AI assistant.");
      }
      const insertedIds = await Promise.all(
        args.records.map(async (record: any) => {
          return await ctx.db.insert("userAiAssistant", {
            ...record,
            aiModelId: "Google:Gemini 2.0 Flash",
            uid: args.uid,
            createdAt: Date.now(), // ✅ Ensure timestamp for sorting
          });
        })
      );
      return insertedIds;
    } catch (error) {
      console.error("Error inserting AI assistant:", error);
      throw new Error("Failed to insert AI assistant.");
    }
  },
});


export const GetAllUsersAssistants = query({
  args: {
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userAiAssistant")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid)) // ✅ Use "by_uid"
      .order("desc") 
      .collect();
  },
});


export const UpdateUserAiAssistant = mutation({
  args: {
    id: v.id("userAiAssistant"),
    userInstruction: v.string(),
    aiModelId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      aiModelId: args.aiModelId,
      userInstruction: args.userInstruction,
    });

    return await ctx.db.get(args.id); // ✅ Return updated record
  },
});

export const DeleteAIAssistant = mutation({
  args: {
    id: v.id("userAiAssistant"),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.id);
    if (!record) {
      throw new Error("AI Assistant not found!");
    }

    await ctx.db.delete(args.id);
    return { message: "AI Assistant deleted successfully!", id: args.id };
  },
});
