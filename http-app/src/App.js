import React, { Component } from "react";
import Http from "./Services/HttpService";
import { ApiURL } from "./Config.json";
import { ToastContainer } from "react-toastify";

class App extends Component {
    state = {
        Posts: [],
    };

    async componentDidMount() {
        const { data: Posts } = await Http.get(ApiURL);
        this.setState({ Posts });
    }

    handleAdd = async () => {
        const { Posts } = this.state;

        const Obj = { title: "Title", body: "Body" };
        const { data: Post } = await Http.post(ApiURL, Obj);
        const AllPosts = [Post, ...Posts];
        this.setState({ Posts: AllPosts });
    };

    handleUpdate = async (post) => {
        const { Posts } = this.state;

        post.title = "Updated";
        await Http.put(`${ApiURL}/${post.id}`);
        const AllPosts = [...Posts];
        const index = AllPosts.indexOf(post);
        AllPosts[index] = { ...post };
        this.setState({ Posts: AllPosts });
    };

    handleDelete = async (post) => {
        const { Posts } = this.state;

        const originalPosts = [...Posts];

        const AllPosts = Posts.filter((p) => p.id !== post.id);
        this.setState({ Posts: AllPosts });

        try {
            await Http.delete(`${ApiURL}/${post.id}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("This Post Has Been Already Deleted!");
            }
            this.setState({ Posts: originalPosts });
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
                        {this.state.Posts.map((post) => (
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
