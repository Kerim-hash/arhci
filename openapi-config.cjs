const config = {
  schemaFile: './openapi.yaml',
  apiFile: './services/api.ts',
  apiImport: 'apiSlice',
  outputFile: './services/generatedApi.ts',
  exportName: 'generatedApi',
  hooks: true,
}

module.exports = config;
