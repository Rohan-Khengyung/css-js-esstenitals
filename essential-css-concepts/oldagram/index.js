const posts = [
    {
        name: "Vincent van Gogh",
        username: "vincey1853",
        location: "Zundert, Netherlands",
        avatar: "images/avatar-vangogh.jpg",
        post: "images/post-vangogh.jpg",
        comment: "just took a few mushrooms lol",
        likes: 21
    },
    {
        name: "Gustave Courbet",
        username: "gus1819",
        location: "Ornans, France",
        avatar: "images/avatar-courbet.jpg",
        post: "images/post-courbet.jpg",
        comment: "i'm feelin a bit stressed tbh",
        likes: 4
    },
    {
        name: "Joseph Ducreux",
        username: "jd1735",
        location: "Paris, France",
        avatar: "images/avatar-ducreux.jpg",
        post: "images/post-ducreux.jpg",
        comment: "gm friends! which coin are YOU stacking up today?? post below and WAGMI!",
        likes: 152
    }
];

// Function to create and display posts
function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    // Loop through each post object
    posts.forEach(post => {
        // Create HTML for each post using template literals
        const postHTML = `
            <div class="post">
                <div class="post-header">
                    <img class="post-avatar" src="${post.avatar}" alt="${post.name} avatar">
                    <div class="post-user-info">
                        <h3 class="post-name">${post.name}</h3>
                        <p class="post-location">${post.location}</p>
                    </div>
                </div>
                <img class="post-image" src="${post.post}" alt="Post by ${post.name}">
                <div class="post-interactions">
                    <div class="icons">
                        <img src="images/icon-heart.png" class="icon heart" alt="Like">
                        <img src="images/icon-comment.png" class="icon comment" alt="Comment">
                        <img src="images/icon-dm.png" class="icon dm" alt="Share">
                    </div>
                    <p class="likes"><strong>${post.likes} likes</strong></p>
                    <p class="caption"><strong>${post.username}</strong> ${post.comment}</p>
                </div>
            </div>
        `;
        
        // Insert the HTML into the container
        postsContainer.innerHTML += postHTML;
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', renderPosts);