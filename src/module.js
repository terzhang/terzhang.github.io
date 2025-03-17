import { UserManager } from "oidc-client-ts";

const cognitoAuthConfig = {
    authority: "https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_AZEfipOHO",
    client_id: "3rk6f9akta9mq5n27be9aeh00r",
    redirect_uri: "http://localhost:5500",
    response_type: "code",
    scope: "phone openid email"
};

// create a UserManager instance
export const userManager = new UserManager({
    ...cognitoAuthConfig,
});

export async function signOutRedirect () {
    const clientId = "3rk6f9akta9mq5n27be9aeh00r";
    const logoutUri = "http://localhost:5500";
    const cognitoDomain = "https://ca-central-1azefipoho.auth.ca-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

// loginElement.style.display = "none";
document.getElementById("login").addEventListener("click", async () => {
    await userManager.signinRedirect();
});

function createLogoutButton(parentElement, iconElement) {
    // create logout button
    const logoutButton = document.createElement("button");
    logoutButton.id = "logout";
    logoutButton.innerText = "Logout";
    logoutButton.type = "button";
    logoutButton.addEventListener("click", async () => {
        // await userManager.revokeTokens()
        await userManager.removeUser()
        await signOutRedirect();
    });
    parentElement.appendChild(logoutButton);
    if (iconElement) {
        logoutButton.prepend(iconElement);
    }
}

// check if the user is authenticated
if (sessionStorage.getItem("authState") === "error") {
    const loginElement = document.getElementById("login")
    loginElement.style.display = "block";
    sessionStorage.removeItem("authState");
    console.log('Unable to authenticate')
} else if (sessionStorage.getItem("authState") === "success") {
    // redirect to dashboard
    // window.location.href = "/dashboard";
    sessionStorage.removeItem("authState");
    console.log('Successfully authenticated')
}

userManager.signinCallback().then(user => {
    const loginElement = document.getElementById("login")

    if (!user) {
        console.log('User not found')
        loginElement.style.display = "block";
        return;
    }

    // console.log(user);
    loginElement.style.display = "none";
    const userIcon = loginElement.querySelector("img");
    createLogoutButton(loginElement.parentElement, userIcon);

    const customHeader = new Headers({
        "Authorization": user.id_token,
        'Content-Type': 'text/html',
    });

    const requestOptions = {
        method: 'GET',
        headers: customHeader,
        redirect: 'follow',
        mode: 'cors' // Change mode to 'cors'
    };

    fetch("https://s2a452qiua.execute-api.ca-central-1.amazonaws.com/Development/authenticate", requestOptions)
        .then(async response => {
            
            if (response.ok) {
                return response.text()
            }
            console.log('Unable to authenticate')
            sessionStorage.setItem("authState", "failure");
            await userManager.removeUser()
            await signOutRedirect();
        })
        .then(result => {
            document.body.innerHTML = result;
            // window.location.href = "/dashboard";
            sessionStorage.setItem("authState", "success");
        })
        .catch(async error => {
            await userManager.removeUser()
            await signOutRedirect();
            console.log('error', error)
            sessionStorage.setItem("authState", "error");
        });
}).catch(() => {
    // not signed in
    console.log('User not signed in')
})
