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
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (!existingUser) {
      const newUser = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 5000,
      };
      const userId = await ctx.db.insert("users", newUser);
      return await ctx.db.get(userId); // Return full user object including generated _id
    }
    return existingUser;
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first(); // Return the first matching user
  },
});

export const UpdateTokens = mutation({
  args: {
    uid: v.id("users"),
    credits: v.number(),
    orderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.orderId) {
      return await ctx.db.patch(args.uid, {
        credits: args.credits,
      });
    } else {
      return await ctx.db.patch(args.uid, {
        credits: args.credits,
        orderId: args.orderId,
      });
    }
  },
});
