const fs = require('fs');

let inputFilePath = process.argv[2] || null;

if (!inputFilePath) {
  console.log('Usage: node index <input file>');
  process.exit();
}

// Read the input XLIFF from file.
let input = fs.readFileSync(inputFilePath, 'utf8');

// True if input format is XLIFF v2.0, in which case output will be XLIFF v1.2.
// Otherwise input is assumed to be XLIFF v1.2 and output will be XLIFF v2.0.
let inputIsV2 = input.indexOf('version="2.0"') >= 0;
let inputVersion = inputIsV2 ? '2_0' : '1_2';
let outputVersion = inputIsV2 ? '1_2' : '2_0';
let xliffToJs = require(`xliff/${ inputIsV2 ? 'xliff2js' : 'xliff12ToJs' }`);
let jsToXliff = require(`xliff/${ inputIsV2 ? 'jsToXliff12' : 'js2xliff' }`);

let outputFilePath = inputFilePath.replace('.xlf', `_${ outputVersion }.xlf`);

// Parse the input XLIFF into a JS object.
xliffToJs(input, (err, xliffAsJs) => {
  if (err) {
    console.error(`Error parsing XLIFF to JS: ${ err }`);
    process.exit(1);
  }

  // Convert the JS object into another XLIFF version.
  jsToXliff(xliffAsJs, (err, output) => {
    if (err) {
      console.error(`Error converting JS to XLIFF: ${ err }`);
      process.exit(1);
    }

    // Output the converted XLIFF.
    fs.writeFileSync(outputFilePath, output, 'utf8');
  });
});
