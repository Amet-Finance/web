const config = {
    apps: [
        {
            name: 'amet-fi-web',      // Name of your app
            script: 'npm',            // The script to run
            args: 'start',            // The script's arguments
            cwd: './',                // Current working directory
            watch: true,              // Enable watching for changes
            ignore_watch: ['node_modules', '.next'],
        },
    ],
};

export default config;
