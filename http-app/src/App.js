import React, { Component } from "react";
import http from "./Services/HttpService";
import { apiURL } from "./Config.json";
import { ToastContainer } from "react-toastify";

class App extends Component {
    state = {
        posts: [],
    };

    async componentDidMount() {
        const { data: posts } = await http.get(apiURL);
        this.setState({ posts });
    }

    handleAdd = async () => {
        const { posts } = this.state;

        const obj = { title: "Title", body: "Body" };
        const { data: post } = await http.post(apiURL, obj);
        const posts = [post, ...posts];
        this.setState({ posts });
    };

    handleUpdate = async (post) => {
        const { posts } = this.state;

        post.title = "Updated";
        await http.put(`${apiURL}/${post.id}`);
        const posts = [...posts];
        const index = posts.indexOf(post);
        posts[index] = { ...post };
        this.setState({ posts });
    };

    handleDelete = async (post) => {
        const { posts } = this.state;

        const originalPosts = [...posts];

        const posts = posts.filter((p) => p.id !== post.id);
        this.setState({ posts });

        try {
            await http.delete(`${apiURL}/${post.id}`);
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
                <button
                    className="my-2 btn btn-primary"
                    onClick={this.handleAdd}
                >
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
