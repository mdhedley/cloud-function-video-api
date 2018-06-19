exports.videoGCS = (event,callback) => {
const file = event.data;
const filename = file.name
const bucket = file.bucket
const outputBucketName = 'mdh-output-bucket'

console.log('past file details')
// Imports the Google Cloud Video Intelligence library
const videoIntelligence = require('@google-cloud/video-intelligence');
console.log('imported videointelligence')

// Creates a client
const client = new videoIntelligence.VideoIntelligenceServiceClient();
console.log('created client')

const fullname = 'gs://' + bucket + '/' + filename

console.log('Fullname=' + fullname)

const Storage = require('@google-cloud/storage')

console.log('imported storage')
//request
const request = {
    inputUri: fullname,
    features: ['LABEL_DETECTION']
}

 client.annotateVideo(request)
.then( results => {
    const operation = results[0];
    console.log('waiting for operation to complete')
    return operation.promise();
}).then(results => {
    console.log('got response')
    const annotations = results[0].annotationResults[0];
    const labels = annotations.segmentLabelAnnotations;
    const storage = new Storage();
    const bucket = storage.bucket(outputBucketName);
    const upFile = bucket.file(filename +'.json');
    upFile.save(JSON.stringify(labels))
    callback();

}) 

}