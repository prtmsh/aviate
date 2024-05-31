document.addEventListener('DOMContentLoaded', () => {
    const identifyButton = document.getElementById('identifyButton');
    identifyButton.addEventListener('click', extractAndIdentifySpecies);
});

async function extractAndIdentifySpecies() {
    const fileInput = document.getElementById('audioFile');
    if (fileInput.files.length === 0) {
        alert("Please upload an audio file.");
        return;
    }
    const file = fileInput.files[0];

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    try {
        // Convert the file to an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Extract features from the uploaded audio
        const features = await extractFeatures(audioBuffer);

        // Validate extracted features (optional)
        if (!isValidFeatureSet(features)) {
            alert('Invalid features extracted. Please try a different audio file.');
            return;
        }

        // Load extracted features from extracted.json
        fetch('/extracted')
            .then(response => response.json())
            .then(data => {
                let bestMatch = null;
                let bestDistance = Infinity;

                // Compare extracted features with reference features from extracted.json
                data.forEach(referenceAudio => {
                    const referenceFeatures = referenceAudio.features;
                    const distance = calculateSimilarity(features, referenceFeatures);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestMatch = referenceAudio.metadata.identifier;
                    }
                });

                // Update the result directly
                const resultElement = document.getElementById('result');
                resultElement.innerText = bestMatch ? `Identified species: ${bestMatch}` : "Species not recognized.";
            })
            .catch(error => {
                console.error('Error loading extracted features:', error);
                alert('An error occurred while fetching reference data. Please try again.');
            });
    } catch (error) {
        console.error('Error processing audio file:', error);
        alert('An error occurred while processing the audio file. Please try again.');
    } finally {
        // Release audio context resources (optional)
        audioContext.close();
    }
}

// Function to calculate similarity between two feature sets (basic implementation)
function calculateSimilarity(features1, features2) {
    // You can implement a more sophisticated similarity metric here
    const squaredDifferences = Object.keys(features1).reduce((sum, feature) => {
        const diff = features1[feature] - features2[feature];
        return sum + (diff * diff);
    }, 0);
    return Math.sqrt(squaredDifferences);
}

// Function to validate extracted features (optional)
function isValidFeatureSet(features) {
    // Implement logic to check if features are valid (e.g., not empty or within expected ranges)
    // You can return true/false based on your validation criteria
    return true; // Placeholder for now
}
