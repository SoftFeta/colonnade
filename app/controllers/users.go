package controllers

import (
    "github.com/revel/revel"
    "encoding/json"
    "io/ioutil"
    "github.com/janekolszak/revmgo"
    "github.com/ip4368/colonnade/app/models"
)

func init() {
    revmgo.ControllerInit()
    models.GuardUsers()
}

type Users struct {
    *revel.Controller
    revmgo.MongoController
}

type RegisterProfile struct {
    Username string `json:"username"`
    Password string `json:"password"`
    Email string `json:"email"`
    Name string `json:"name"`
}

func (c Users) Register() revel.Result {
    // read request body to byte
    var r RegisterProfile
    var bodyBytes []byte
    if c.Request.Body != nil {
        bodyBytes, _ = ioutil.ReadAll(c.Request.Body)
    }
    json.Unmarshal([]byte(bodyBytes), &r)

    result := models.RegisterHandler(c.MongoSession, r.Email, r.Username, r.Password, r.Name)

    // start with initialise response interface
    data := make(map[string]interface{})
    data["error"] = result
    switch result {
        case 0 :
            data["message"] = "Successfully Registered"
        case 1 :
            data["message"] = "Invalid Email"
        case 2 :
            data["message"] = "Invalid Username"
        case 3 :
            data["message"] = "Invalid Password"
        case 4 :
            data["message"] = "Invalid Name"
        case 5 :
            data["message"] = "Username/Password has been used"
    }
    return c.RenderJson(data)
}

func (c Users) Login() revel.Result {
    // read request body to byte
    var r RegisterProfile
    var bodyBytes []byte
    if c.Request.Body != nil {
        bodyBytes, _ = ioutil.ReadAll(c.Request.Body)
    }
    json.Unmarshal([]byte(bodyBytes), &r)

    result, identifier, id, name := models.LoginHandler(c.MongoSession, r.Email, r.Password)

    // start with initialise response interface
    data := make(map[string]interface{})
    data["error"] = result
    switch result {
        case 0 :
            data["message"] = "Successfully Logged In"
            data["data"] = make(map[string]interface{})
            data["data"].(map[string]interface{})["name"] = name
            c.Session["email"] = identifier[0]
            c.Session["username"] = identifier[1]
            c.Session["userId"] = id
        case 1 :
            data["message"] = "Invalid Login Details"
        case 2 :
            data["message"] = "Email is not registered"
        case 3 :
            data["message"] = "User has been suspended"
        case 4 :
            data["message"] = "Password incorrect"
    }
    return c.RenderJson(data)
}

func (c Users) Logout() revel.Result {
    result := models.LogoutHandler(
        c.Session["email"],
        c.Session["username"],
        c.Session["userId"],
    )

    // start with initialise response interface
    data := make(map[string]interface{})
    data["error"] = result
    switch result {
        case 0 :
            data["message"] = "Successfully Logged Out"
            if c.Session["email"] != "" {c.Session["email"] = "" }
            if c.Session["username"] != "" { c.Session["username"] = "" }
            if c.Session["userId"] != "" { c.Session["userId"] = "" }
        case 1 :
            data["message"] = "Not Logged In"
    }
    return c.RenderJson(data)
}
