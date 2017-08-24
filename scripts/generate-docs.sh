#!/bin/sh
TYPEDOC_OUT="docs"
rm -rf $TYPEDOC_OUT
echo "Old documentation removed."
typedoc --excludeExternals --hideGenerator --ignoreCompilerErrors --includeDeclarations --mode modules --name "Metabolica Documentation" --out $TYPEDOC_OUT --readme GUIDES.md --module ES2015 --target ES5 --tsconfig tsconfig.json src
babel ./scripts/include-guides-to-typedoc.js | node
echo "Done!"
