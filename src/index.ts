import express from "express"; 
import postsRouter from "./routes/posts.router";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/posts', postsRouter)

app.get('/', (req, res) => {
    res.send("hallo nzaa");
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
