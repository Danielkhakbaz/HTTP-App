import React, { Component } from "react";
import axios from "axios";
import config from "./Config.json";
import "./App.css";

class App extends Component {
    state = {
        posts: [],
    };

    async componentDidMount() {
        const { data: posts } = await axios.get(config.apiURL);
        this.setState({ posts });
    }

    handleAdd = async () => {
        const obj = { title: "Title", body: "Body" };
        const { data: post } = await axios.post(config.apiURL, obj);
        const posts = [post, ...this.state.posts];
        this.setState({ posts });
    };

    handleUpdate = async (post) => {
        post.title = "Updated";
        await axios.put(config.apiURL + "/" + post.id);
        const posts = [...this.state.posts];
        const index = posts.indexOf(post);
        posts[index] = { ...post };
        this.setState({ posts });
    };

    handleDelete = async (post) => {
        const posts = this.state.posts.filter((p) => p.id !== post.id);
        this.setState({ posts });

        await axios.delete(config.apiURL + "/" + post.id);
    };

    render() {
        return (
            <React.Fragment>
                <button className="btn btn-primary" onClick={this.handleAdd}>
                    Add
                </button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => this.handleUpdate(post)}
                                    >
                                        Update
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => this.handleDelete(post)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default App;
