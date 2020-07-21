import React, { Component } from "react";
import http from "./Services/HttpService";
import config from "./Config.json";
import { ToastContainer } from "react-toastify";
import "./App.css";

class App extends Component {
    state = {
        posts: [],
    };

    async componentDidMount() {
        const { data: posts } = await http.get(config.apiURL);
        this.setState({ posts });
    }

    handleAdd = async () => {
        const obj = { title: "Title", body: "Body" };
        const { data: post } = await http.post(config.apiURL, obj);
        const posts = [post, ...this.state.posts];
        this.setState({ posts });
    };

    handleUpdate = async (post) => {
        post.title = "Updated";
        await http.put(config.apiURL + "/" + post.id);
        const posts = [...this.state.posts];
        const index = posts.indexOf(post);
        posts[index] = { ...post };
        this.setState({ posts });
    };

    handleDelete = async (post) => {
        const posts = this.state.posts.filter((p) => p.id !== post.id);
        this.setState({ posts });

        const originalPosts = [...this.state.posts];
        try {
            await http.delete("n" + config.apiURL + "/" + post.id);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("This Post Has Been Already Deleted!");
            }
            this.setState({ posts: originalPosts });
        }
    };

    render() {
        return (
            <React.Fragment>
                <ToastContainer />
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
