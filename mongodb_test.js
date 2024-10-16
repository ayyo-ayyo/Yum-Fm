const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://spedda:yumfm2024@yumfm.socqf.mongodb.net/?retryWrites=true&w=majority&appName=YumFM";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Select the database and collection
    const database = client.db("sample_mflix"); // Replace with your database name
    const comments = database.collection("comments"); // Access the 'comments' collection

    // Query the first 10 documents from the 'comments' collection
    const first10Comments = await comments.find({}).limit(5).toArray(); // Retrieve first 10 documents

    first10Comments.forEach(element => {
       console.log(element._id);
       console.log(element.text)
    });

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Connection closed.");
  }
}

run().catch(console.dir);
