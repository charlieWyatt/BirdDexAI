const ort = require('onnxruntime-node');
const sharp = require('sharp');
const fs = require('fs');

async function main() {

    // Create a new session and load the specific model
    const session = await ort.InferenceSession.create("../fasterrcnn-pytorch-training-pipeline/weights/model.onnx");

    // Log the input names
    console.log("Model Input Names:", session.inputNames);

    
    try {
        // Load and preprocess the image
        const imagePath = "testImage.jpg"; // Path to your image file
        const width = 640;  // Adjust width as per your model's input requirement
        const height = 640; // Adjust height as per your model's input requirement

        const imageBuffer = fs.readFileSync(imagePath);
        const preprocessedImage = await sharp(imageBuffer)
            .resize(width, height)
            .raw()
            .toBuffer();
        
        // Convert the image data to a Float32Array and normalize if necessary
        let imageData = new Float32Array(preprocessedImage);
        // Optionally, normalize the image data here if your model expects normalized data

        // Create a tensor with the preprocessed image
        const tensorInput = new ort.Tensor('float32', imageData, [1, 3, height, width]); // Adjust shape [1, 3, height, width] as per your model's input requirement

        // create a new session and load the specific model
        const session = await ort.InferenceSession.create("../fasterrcnn-pytorch-training-pipeline/weights/model.onnx");

        // prepare feeds. use model input names as keys.
        const feeds = { 'input': tensorInput };

        // feed inputs and run
        const results = await session.run(feeds);

        // read from results
        // Assuming 'c' is the output name, adjust as per your model's output name
        const dataC = results.c.data;
        console.log(`data of result tensor 'c': ${dataC}`);

    } catch (e) {
        console.error(`failed to inference ONNX model: ${e}.`);
    }
}

main();