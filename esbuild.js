const esbuild = require("esbuild");
const path = require("path");

const production = process.argv.includes('--production');

async function main() {
  const ctxExt = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "out/extension.js",
    external: ["vscode"],
    logLevel: "silent",
  });
  
  const ctxMcp = await esbuild.context({
    entryPoints: ["mcp_server.js"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "out/mcp_server.js",
    external: [], // Bundle all dependencies (SDK) inside
    logLevel: "silent",
  });

  if (process.argv.includes('--watch')) {
    await ctxExt.watch();
    await ctxMcp.watch();
    console.log('Watching...');
  } else {
    await ctxExt.rebuild();
    await ctxExt.dispose();
    await ctxMcp.rebuild();
    await ctxMcp.dispose();
    console.log('Build complete');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
