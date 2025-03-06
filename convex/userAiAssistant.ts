import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; // ✅ Added query import

export const InsertSelectedAssistant = mutation({
    args: {
        records: v.array(v.any()), // ✅ Changed `v.any()` to `v.array(v.any())`
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        const insertedIds = await Promise.all(
            args.records.map(async (record: any) =>
                await ctx.db.insert('userAiAssistant', {
                    ...record,
                    aiModelId:"Google:Gemini 2.0 Falsh",
                    uid: args.uid
                })
            )
        );
        return insertedIds;
    }
});

export const GetAllUsersAssistants = query({
    args: {
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('userAiAssistant')
            .filter(q => q.eq(q.field('uid'), args.uid)).order('desc')
            .collect();
        return result; // ✅ Added return statement
    }
});

export const UpdateUserAiAssistant = mutation({
    args: {
      id: v.id('userAiAssistant'),
      userInstruction: v.string(),
      aiModelId: v.string()
    },
    handler: async (ctx, args) => {
      const result = await ctx.db.patch(args.id, {
        aiModelId: args.aiModelId,
        userInstruction: args.userInstruction
      });
  
      return result;
    }
  });
export const DeleteAIAssistant = mutation({
    args: {
      id: v.id('userAiAssistant')
    },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    }
  });  