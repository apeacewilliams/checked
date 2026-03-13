import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typesArray = loadFilesSync(path.join(__dirname, './typeDefs'), {
  extensions: ['graphql'],
});

export const typeDefs = mergeTypeDefs(typesArray);

const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'), {
  extensions: ['ts', 'js'],
  ignoreIndex: true,
});

export const resolvers = mergeResolvers(resolversArray);
