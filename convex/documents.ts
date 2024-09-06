
import { v } from "convex/values";
import {mutation, query} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }

        const userId = id.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            throw new Error("doc not found.");
        }

        if(existingDocument.userId !== userId){
            throw new Error("unauthorized user");
        }

        const recursiveArchve = async (documentId: Id<"documents">) => {

            const children = await ctx.db.query("documents")
            .withIndex("by_user_parent", (q) => (
                q.eq("userId", userId)
                .eq("parentDocument", documentId)
            )).collect()

            for(const child of children){
                await ctx.db.patch(child._id, {
                    isArchived: true
                });

                await recursiveArchve(child._id);
            }
        }

        const document = await ctx.db.patch(args.id, {
            isArchived: true
        })

        recursiveArchve(args.id);

        return document;

    }
})

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }

        const userId = id.subject;


        const documents = await ctx.db.query("documents").withIndex("by_user_parent", (q)=> 
            q.eq("userId", userId).eq("parentDocument", args.parentDocument)
        ).filter((q)=> 
            q.eq(q.field("isArchived"), false)
        ).order("desc").collect();

        return documents;
    }
})

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }

        const userId = id.subject;
        const document = await ctx.db.insert("documents", {
            title: args.title,
            userId,
            parentDocument: args.parentDocument,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
});

export const getTrash = query({
    handler: async (ctx) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }
        const userId = id.subject;

        const documents = await ctx.db.query("documents").withIndex("by_user", (q) => (
            q.eq("userId", userId)
        )).filter((q) => (
            q.eq(q.field("isArchived"), true)
        )).order("desc").collect();

        return documents;
    }
});

export const restoreTrash = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }
        const userId = id.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            throw new Error("doc not found.");
        }

        if(existingDocument.userId !== userId){
            throw new Error("unauthorized user");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents")
            .withIndex("by_user_parent", (q) => (
                q.eq("userId", userId)
                .eq("parentDocument", documentId)
            )).collect()

            for(const child of children){
                await ctx.db.patch(child._id, {
                    isArchived: false,
                })

                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        }

        if(existingDocument.parentDocument){
            const parent = await ctx.db.get(existingDocument.parentDocument);

            if(parent?.isArchived){
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return document;
    }
});

export const remove = mutation({
    args: {
        id: v.id("documents")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }
        const userId = id.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            throw new Error("doc not found.");
        }

        if(existingDocument.userId !== userId){
            throw new Error("unauthorized user");
        }

        const document = ctx.db.delete(args.id);

        return document;
    }
});


export const getSearch = query({
    handler: async (ctx) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not authenticated user");
        }
        const userId = id.subject;

        const documents = await ctx.db.query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("isArchived"), false)).order("desc").collect();

        return documents;
    }
});


export const getById = query({
    args: {
        documentId: v.id("documents")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        const document = await ctx.db.get(args.documentId);

        if(!document){
            throw new Error("Not found");
        }

        if(document.isPublished && !document.isArchived){
            return document;
        }

        if(!id){
            throw new Error("Not Authenticated.");
        }

        const userId = id.subject;

        if(document.userId !== userId){
            throw new Error("not authorized");
        }

        return document;
    }
})

export const update = mutation({
    args: {
        documentId: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();

        if(!id){
            throw new Error("Not Authenticated.");
        }

        const userId = id.subject;

        const {documentId, ...rest} = args;

        const existingDocument = await ctx.db.get(args.documentId);

        if(!existingDocument){
            throw new Error("Doc Not Found.");
        }

        if(existingDocument.userId !== userId){
            throw new Error("Not authorized.");
        } 

        const document = await ctx.db.patch(args.documentId, {
            ...rest
        });

        return document;

    }
})