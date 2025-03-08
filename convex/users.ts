import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).first();

    if (!existingUser) {
      const newUser = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 5000,
      };
      const userId = await ctx.db.insert("users", newUser);
      return await ctx.db.get(userId); // ✅ Return full user object
    }
    return existingUser;
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).first(); // ✅ Use first()
  },
});



export const UpdateTokens = mutation({
  args: {
    credits: v.number(),
    uid: v.id('users'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.uid, {
      credits: args.credits
    });

    return result;
  }
});
