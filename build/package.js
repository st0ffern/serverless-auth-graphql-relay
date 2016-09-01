const path = require('path');
const exec = require(path.join(__dirname, 'exec')).execSync;
const PackageBuilder = require(path.join(__dirname, 'PackageBuilder'));

const servicePath = serverless.config.servicePath;
const zipFileName = `${serverless.service.service}-${(new Date).getTime().toString()}.zip`;
const artifactFilePath = path.join(servicePath, '.serverless', zipFileName);

console.log("Packing zip files for Lambda...");

exec("Clean Up Environment", "rimraf ._target lib *.zip && mkdir lib");
exec("Compiling", path.join('node_modules', '.bin', 'babel') + " --presets es2015,react --plugins transform-async-to-generator,transform-runtime,transform-class-properties,transform-flow-strip-types -d lib/ src/");

const packageBuilder = new PackageBuilder(servicePath);
packageBuilder.addFolder("lib");
packageBuilder.addFolder("node_modules");

packageBuilder.writeToFileSync(artifactFilePath);

//After set the artifact which serverless need to deploy, serverless will skip the default package process
serverless.service.package.artifact = artifactFilePath;