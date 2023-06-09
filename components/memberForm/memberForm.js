"use client";
import {
    Button,
    Card,
    Container,
    Form,
    FormGroup,
    Image,
    Stack,
} from "react-bootstrap";

import React, { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import axios from "axios";
import useUser from "../../lib/useUser";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
    weight: ["400", "700"],
    subsets: ["vietnamese"],
});
export default function MemberForm({ readerID }) {
    const [imgUrl, setImgUrl] = useState("#");
    const [img, setImg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const { users, mutateUser } = useUser();
    const router = useRouter();
    useEffect(() => {
        async function onCreate() {
            if (readerID && readerID != "undefined") {
                const res = await axios.get("/api/reader/" + readerID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.status == 200) {
                    console.log(res);
                    const data = res.data;
                    document.getElementById("email").value = data.email;
                    document.getElementById("fullName").value = data.name;
                    document.getElementById("readerType").value =
                        data.readerType;
                    document.getElementById("address").value = data.address;
                    document.getElementById("dateOfBirth").value = String(
                        data.dateOfBirth
                    ).substring(0, 10);
                    document.getElementById("memberID").value = data.readerId;
                    document.getElementById("memberDate").style.visibility =
                        "visible";
                    document.getElementById(
                        "memberDate"
                    ).lastElementChild.value = String(
                        data.memberDate
                    ).substring(0, 10);
                }
            } else {
                if (users) {
                    document.getElementById("fullName").disabled = false;
                } else {
                    document.getElementById("fullName").disabled = true;
                }
            }
        }
        onCreate();
    }, [users, selectedUser]);
    if (!isLoading && users)
        return (
            <>
                <Form
                    id="form"
                    style={{ width: "860px" }}
                    onSubmit={async function HandleSubmit(event) {
                        event.preventDefault();
                        console.log(img);
                        const body = {};
                        if (event.currentTarget.fullName.value)
                            body.fullName = event.currentTarget.fullName.value;
                        if (event.currentTarget.readerType.value)
                            body.readerType =
                                event.currentTarget.readerType.value;
                        if (event.currentTarget.address.value)
                            body.address = event.currentTarget.address.value;
                        if (event.currentTarget.dateOfBirth.value)
                            body.dateOfBirth =
                                event.currentTarget.dateOfBirth.value;
                        if (event.currentTarget.email.value)
                            body.email = event.currentTarget.email.value;
                        if (!readerID && selectedUser)
                            (body.user = readerID ? readerID : selectedUser.id),
                                setIsLoading(true);
                        let config = {
                            method: readerID ? "patch" : "post",
                            maxBodyLength: Infinity,
                            url:
                                readerID && readerID != "undefined"
                                    ? "/api/reader/" + readerID
                                    : "/api/reader",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            data: JSON.stringify(body),
                        };
                        const res = await axios
                            .request(config)
                            .then((response) => {
                                if (response.status == 200) {
                                    alert(
                                        (!readerID ? "Add " : "Update ") +
                                            "member successfully"
                                    );
                                    if (response.status == 200 && img) {
                                        console.log(response.data);
                                        const data = new FormData();
                                        const userId = response.data.userId;
                                        data.append("avatar", img);
                                        axios
                                            .patch(
                                                "/api/profile/" + userId,
                                                data,
                                                {
                                                    method: "PATCH",
                                                    headers: {
                                                        "Content-Type":
                                                            "multipart/form-data",
                                                    },
                                                }
                                            )
                                            .then((response) => {
                                                if (response.status == 200) {
                                                    alert(
                                                        "Update avatar successfully"
                                                    );
                                                    if (readerID)
                                                        router.replace(
                                                            "/home/member"
                                                        );
                                                    else
                                                        window.location.reload();
                                                }
                                            })
                                            .catch((error) => {
                                                alert(error.response.data);
                                                if (readerID)
                                                    router.replace(
                                                        "/home/member"
                                                    );
                                                else window.location.reload();
                                            });
                                    } else {
                                        if (response.status == 200) {
                                            if (readerID)
                                                router.replace("/home/member");
                                            else window.location.reload();
                                        }
                                    }
                                } else {
                                    alert(
                                        "There is a problem with the server. \n Please try again in a few seconds or contact to us"
                                    );
                                }
                                return response;
                            })
                            .catch((error) => {
                                alert(error.message.data);
                                window.location.reload();
                            });
                    }}
                >
                    <Button
                        className={montserrat.className}
                        style={{
                            marginBottom: "20px",
                            background: "#4BC1D2",
                            borderColor: "#4BC1D2",
                            fontWeight: "600",
                            height: "30px",
                            width: "80px",
                            marginLeft: "-50px",
                        }}
                        onClick={() => window.location.replace("/home/book")}
                    >
                        <p style={{ marginTop: "-3px" }}>Back</p>
                    </Button>
                    <Stack gap={5}>
                        <Form.Group>
                            <Form.Label className={montserrat.className}>
                                Email
                            </Form.Label>
                            <Form.Control
                                size="lg"
                                type="select"
                                placeholder="Like youremail@gmail.com"
                                id="email"
                                list="userEmail"
                                onChange={(event) => {
                                    const email = event.currentTarget.value;
                                    for (let i = 0; i < users.length; i++) {
                                        const element = users.at(i);
                                        if (element.email == email)
                                            setSelectedUser(element);
                                    }
                                }}
                            />
                        </Form.Group>
                        <datalist id="userEmail">
                            {users ? (
                                <>
                                    {users.map((element, index) => (
                                        <option
                                            id={index}
                                            key={element.id}
                                            value={element.email}
                                        >
                                            {"Id: " + element.id}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <></>
                            )}
                        </datalist>

                        <Stack direction="horizontal" gap={5}>
                            <FormGroup>
                                <Form.Label className={montserrat.className}>
                                    Member ID
                                </Form.Label>
                                <Form.Control
                                    size="lg"
                                    type="id"
                                    disabled={true}
                                    id={"memberID"}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Form.Label className={montserrat.className}>
                                    Member Type
                                </Form.Label>
                                <Form.Control
                                    size="lg"
                                    type="id"
                                    id="readerType"
                                />
                            </FormGroup>
                        </Stack>
                        <Form.Group>
                            <Form.Label className={montserrat.className}>
                                Member Name
                            </Form.Label>
                            <Form.Control
                                size="lg"
                                type="name"
                                placeholder="Your name"
                                id="fullName"
                                defaultValue={
                                    selectedUser == null
                                        ? ""
                                        : selectedUser.name
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={montserrat.className}>
                                Address
                            </Form.Label>
                            <Form.Control
                                size="lg"
                                type="address"
                                placeholder="Address"
                                id="address"
                            />
                        </Form.Group>
                        <Stack direction="horizontal" gap={3} className="">
                            <Form.Group>
                                <Form.Label className={montserrat.className}>
                                    Date of birth
                                </Form.Label>
                                <Form.Control
                                    size="lg"
                                    type="date"
                                    placeholder="Date of birth"
                                    id="dateOfBirth"
                                />
                            </Form.Group>
                            <Form.Group
                                id="memberDate"
                                style={{ visibility: "hidden" }}
                            >
                                <Form.Label className={montserrat.className}>
                                    Member date
                                </Form.Label>
                                <Form.Control
                                    size="lg"
                                    type="date"
                                    placeholder="Member date"
                                />
                            </Form.Group>
                        </Stack>
                        <Container
                            className="d-flex justify-content-center"
                            style={{ width: "100%" }}
                        >
                            <Card
                                className="text-center"
                                style={{ width: "685px" }}
                            >
                                <Card.Header className={montserrat.className}>
                                    Image
                                </Card.Header>
                                <Card.Body>
                                    <Stack
                                        className="d-flex align-items-center"
                                        style={{ width: "100%" }}
                                        gap={4}
                                    >
                                        <Image
                                            id="ImageHolder"
                                            src={imgUrl}
                                            alt=""
                                            style={{
                                                backgroundColor: "#D2DDE0",
                                                width: "300px",
                                                height: "369px",
                                            }}
                                        />
                                        <Form.Group>
                                            <Form.Control
                                                size="lg"
                                                id="ImageControl"
                                                type="file"
                                                onChange={(event) => {
                                                    if (
                                                        document.getElementById(
                                                            "ImageControl"
                                                        ).files[0]
                                                    ) {
                                                        setImg(
                                                            document.getElementById(
                                                                "ImageControl"
                                                            ).files[0]
                                                        );
                                                        setImgUrl(
                                                            URL.createObjectURL(
                                                                document.getElementById(
                                                                    "ImageControl"
                                                                ).files[0]
                                                            )
                                                        );
                                                        document.getElementById(
                                                            "ImageHolder"
                                                        ).style.backgroundColor =
                                                            "transparent";
                                                        document.getElementById(
                                                            "ImageHolder"
                                                        ).style.width = "300px";
                                                        document.getElementById(
                                                            "ImageHolder"
                                                        ).style.height =
                                                            "369px";
                                                        console.log(img);
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </Container>
                        <Container
                            className="d-flex flex-row justify-content-between"
                            style={{ width: "685px" }}
                        >
                            <Button
                                type="summit"
                                className={montserrat.className}
                                style={{
                                    width: "231px",
                                    height: "48px",
                                    borderRadius: "20px",
                                    backgroundColor: "#44B8CB",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                    borderColor: "#44B8CB",
                                }}
                            >
                                Submit
                            </Button>
                            <Button
                                className={montserrat.className}
                                style={{
                                    width: "231px",
                                    height: "48px",
                                    borderRadius: "20px",
                                    backgroundColor: "#D9D9D9",
                                    color: "black",
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                    borderColor: "#D9D9D9",
                                }}
                            >
                                Cancel
                            </Button>
                        </Container>
                    </Stack>
                </Form>
            </>
        );
    else
        return (
            <main
                className="d-flex justify-content-center align-items-center"
                style={{ width: "100%", height: "100%" }}
            >
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </main>
        );
}
