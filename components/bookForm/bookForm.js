"use client";
import axios from "axios";
import { Montserrat, Roboto } from "next/font/google";
import React, { useEffect, useState } from "react";
import FormData from "form-data";
import {
    Col,
    Container,
    Form,
    FormControl,
    Row,
    Button,
    Stack,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import BookAPI from "../../endpoint/bookAPI";
import Book from "../../models/Book";
const montserrat = Montserrat({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["vietnamese"],
    style: "normal",
});

export default function BookForm({ id }) {
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        async function onCreate() {
            if (id) {
                await axios
                    .get("/api/book/" + id, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                    .then((response) => {
                        const data = response.data.data.doc;
                        document.getElementById("bookTitle").value =
                            data.nameBook;
                        document
                            .getElementById("bookTitle")
                            .setAttribute("disabled", true);
                        document.getElementById("author").value = data.author;
                        document.getElementById("description").value =
                            data.description;
                        document.getElementById("publisher").value =
                            data.publisher;
                        document.getElementById("amount").value =
                            data.numberOfBooks;
                        document.getElementById("price").value = data.price;
                        document.getElementById("year").value =
                            data.publicationYear;
                    })
                    .catch((error) => {
                        alert(error.response.data);
                        router.back();
                    });
            }
        }
        onCreate();
    }, [id]);
    return (
        <main>
            <Stack direction="horizontal">
                <Button
                    className={montserrat.className}
                    style={{
                        marginBottom: "50px",
                        background: "#4BC1D2",
                        borderColor: "#4BC1D2",
                        fontWeight: "600",
                        height: "30px",
                        width: "80px",
                    }}
                    onClick={() => window.location.replace("/home/book")}
                >
                    <p style={{ marginTop: "-3px" }}>Back</p>
                </Button>
                <h1
                    className={montserrat.className}
                    style={{
                        marginBottom: "50px",
                        marginLeft: "250px",
                        fontWeight: "600",
                    }}
                >
                    Book Information
                </h1>
            </Stack>
            <Container
                style={{
                    width: "100%",
                    maxWidth: "1178px",
                    paddingLeft: "80px",
                    paddingRight: "100px ",
                    height: "100%",
                }}
            >
                {!loading ? (
                    <Form
                        onSubmit={async function HandleSummitEvent(event) {
                            event.preventDefault();
                            const body = {};
                            body.typeBook = "book";
                            if (event.currentTarget.bookTitle.value)
                                body.nameBook =
                                    event.currentTarget.bookTitle.value;
                            if (event.currentTarget.author.value)
                                body.author = event.currentTarget.author.value;
                            if (event.currentTarget.year.value)
                                body.publicationYear =
                                    event.currentTarget.year.value;
                            if (event.currentTarget.publisher.value)
                                body.publisher =
                                    event.currentTarget.publisher.value;
                            if (event.currentTarget.year.value)
                                body.year = event.currentTarget.year.value;
                            if (event.currentTarget.price.value)
                                body.price = event.currentTarget.price.value;
                            if (event.currentTarget.description.value)
                                body.description =
                                    event.currentTarget.description.value;
                            if (event.currentTarget.amount.value)
                                (body.numberOfBooks =
                                    event.currentTarget.amount.value),
                                    setLoading(true);
                            let config = {
                                method: id ? "patch" : "post",
                                maxBodyLength: Infinity,
                                url: id ? "/api/book/" + id : "/api/book/",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                data: JSON.stringify(body),
                            };

                            const res = await axios
                                .request(config)
                                .then((response) => {
                                    return response;
                                })
                                .catch((error) => {
                                    alert(error.response.data);
                                    window.location.reload();
                                });
                            if (res.status == 200 && img) {
                                const data = new FormData();

                                data.append("photos", img);
                                const bookID = res.data.id;
                                await axios
                                    .patch("/api/book/" + bookID, data, {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type":
                                                "multipart/form-data",
                                        },
                                    })
                                    .then((response) => {
                                        alert(
                                            (id ? "Update" : "Create") +
                                                " book successfully"
                                        );
                                        if (id) router.back();
                                        else window.location.reload();
                                    })
                                    .catch((error) =>
                                        alert(error.response.data)
                                    );
                            } else {
                                alert(
                                    (id ? "Update" : "Create") +
                                        " book successfully"
                                );
                                router.replace("/home/book/" + id);
                            }
                            setLoading(false);
                        }}
                    >
                        <div className="form-group">
                            <label className={montserrat.className}>
                                Title:
                            </label>
                            <FormControl
                                type="text"
                                id="bookTitle"
                                style={{ marginTop: "10px" }}
                            />
                        </div>
                        <div
                            className="form-group"
                            style={{ marginTop: "20px" }}
                        >
                            <label className={montserrat.className}>
                                Author:
                            </label>
                            <FormControl
                                type="text"
                                id="author"
                                style={{ marginTop: "10px" }}
                            />
                        </div>
                        <div
                            className="form-group"
                            style={{ marginTop: "20px" }}
                        >
                            <label className={montserrat.className}>
                                Description:
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                rows={5}
                                style={{ marginTop: "10px" }}
                            ></textarea>
                        </div>
                        <div
                            className="form-group"
                            style={{ marginTop: "20px" }}
                        >
                            <label className={montserrat.className}>
                                Publisher:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="publisher"
                                style={{ marginTop: "10px" }}
                            />
                        </div>
                        <div
                            className="form-group"
                            style={{ marginTop: "20px" }}
                        >
                            <div className="row" style={{ marginTop: "10px" }}>
                                <Col xs={10}>
                                    <label className={montserrat.className}>
                                        Publish Date:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="year"
                                        placeholder="Year"
                                    />
                                </Col>
                                <Col xs={2}>
                                    <div className="form-group">
                                        <label className={montserrat.className}>
                                            Amount:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="amount"
                                        />
                                    </div>
                                </Col>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col">
                                <div className="form-group">
                                    <label className={montserrat.className}>
                                        Number of Pages:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pages"
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label className={montserrat.className}>
                                        Price:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="price"
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label className={montserrat.className}>
                                        Cover Image:
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="coverImage"
                                        onChange={(event) => {
                                            if (event.currentTarget.files)
                                                setImg(
                                                    event.currentTarget.files[0]
                                                );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr style={{ marginTop: "50px" }} />
                        <div className="d-flex justify-content-start">
                            <button
                                type="submit"
                                className="btn btn-info"
                                style={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                    width: "200px",
                                    borderRadius: "10px",
                                    marginBottom: "50px",
                                    marginTop: "20px",
                                    marginRight: "50px",
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </Form>
                ) : (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "100%", height: "100%" }}
                    >
                        <div
                            className="spinner-border"
                            role="status"
                            style={{
                                width: "100px",
                                height: "100px",
                                marginTop: "200px",
                            }}
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </Container>
        </main>
    );
}
