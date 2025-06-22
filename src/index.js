function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then((response) => response.json())
    .then((posts) => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.forEach((post) => {
        const postElement = createPostElement(post);
        postList.appendChild(postElement);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0]);
      } else {
        document.getElementById("post-detail").innerHTML =
          "<p>No posts available</p>";
      }
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "post-item";
  postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>By ${post.author}</p>
    `;
  postElement.addEventListener("click", () => handlePostClick(post));
  return postElement;
}

function handlePostClick(post) {
  const postDetail = document.getElementById("post-detail");
  postDetail.innerHTML = `
      <h2>${post.title}</h2>
      <p><strong>Author:</strong> ${post.author}</p>
      <p><strong>Content:</strong> ${post.content}</p>
      <button id="edit-post">Edit</button>
      <button id="delete-post">Delete</button>
    `;

  document
    .getElementById("edit-post")
    .addEventListener("click", () => showEditForm(post));
  document
    .getElementById("delete-post")
    .addEventListener("click", () => deletePost(post));
}

function showEditForm(post) {
  const editForm = document.getElementById("edit-post-form");
  editForm.classList.remove("hidden");

  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;

  editForm.onsubmit = (event) => {
    event.preventDefault();
    updatePost(post);
  };

  document.getElementById("cancel-edit").addEventListener(
    "click",
    () => {
      editForm.classList.add("hidden");
      editForm.onsubmit = null;
    },
    { once: true }
  );
}

function updatePost(post) {
  const updatedTitle = document.getElementById("edit-title").value;
  const updatedContent = document.getElementById("edit-content").value;

  fetch(`http://localhost:3000/posts/${post.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: updatedTitle,
      content: updatedContent,
    }),
  })
    .then((response) => response.json())
    .then((updatedPost) => {
      post.title = updatedPost.title;
      post.content = updatedPost.content;

      const postList = document.getElementById("post-list");
      const postItems = postList.querySelectorAll(".post-item");
      postItems.forEach((item) => {
        if (item.querySelector("h3").textContent === post.title) {
          item.innerHTML = `
              <h3>${post.title}</h3>
              <p>By ${post.author}</p>
            `;
        }
      });

      document.getElementById("post-detail").innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Content:</strong> ${post.content}</p>
        <button id="edit-post">Edit</button>
        <button id="delete-post">Delete</button>
      `;

      document
        .getElementById("edit-post")
        .addEventListener("click", () => showEditForm(post));
      document
        .getElementById("delete-post")
        .addEventListener("click", () => deletePost(post));

      // Hide the edit form after update
      const editForm = document.getElementById("edit-post-form");
      editForm.classList.add("hidden");
      editForm.onsubmit = null;
    })
    .catch((error) => {
      alert("Failed to update post.");
      console.error("Error updating post:", error);
    });
}

// Properly separated deletePost function
function deletePost(post) {
  // Send DELETE request to backend
  fetch(`http://localhost:3000/posts/${post.id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete post");
      const postList = document.getElementById("post-list");
      const postItems = postList.querySelectorAll(".post-item");
      postItems.forEach((item) => {
        if (item.querySelector("h3").textContent === post.title) {
          item.remove();
        }
      });

      document.getElementById("post-detail").innerHTML =
        "<p>Select a post to view details</p>";

      if (!postList.querySelector(".post-item")) {
        document.getElementById("post-detail").innerHTML =
          "<p>No posts available</p>";
      }
    })
    .catch((error) => {
      alert("Failed to delete post.");
      console.error("Error deleting post:", error);
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const content = document.getElementById("content").value.trim();
    const image =
      document.getElementById("image").value.trim() ||
      "https://picsum.photos/400/200?random=" + Date.now();

    if (!title || !author || !content) {
      alert("Please fill out all fields");
      return;
    }

    const newPost = { title, author, content, image };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((post) => {
        const postList = document.getElementById("post-list");
        const postElement = createPostElement(post);
        postList.appendChild(postElement);
        form.reset();
        handlePostClick(post);
      })
      .catch((error) => console.error("Error creating post:", error));
  });
}

document.addEventListener("DOMContentLoaded", main);
