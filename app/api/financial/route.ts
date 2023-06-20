import { NextRequest, NextResponse } from "next/server";
import endpoint from "../../../endpoint/Utils";
import axios from "axios";
import Financial from "../../../models/financial";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    if (token) {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: endpoint + '/api/v1/user-financials/me',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODJlY2ZmYjk4NzcxYThjZTIwZDI1MyIsImlhdCI6MTY4NjgyMjgxOSwiZXhwIjoxNjg3NDI3NjE5fQ.GRrdKcIPXbK7OVjdF-UA1l3c8zlcPBex10fpDBWaz8A'
            }
        };

        const response = await axios.request(config)
        if (response.status == 200) {
            const data = response.data.userFinancials;
            if (data) {

                const financial = new Financial(data._id, data.user, data.balance, data.totalDebt)
                return NextResponse.json(financial, { status: 200, statusText: "Success" });
            }
            else
            return NextResponse.json(null, { status: 204, statusText: "No Content" })

        }
        else
            return NextResponse.json(null, { status: response.status, statusText: response.statusText })
    }
    else
        return NextResponse.json(null, { status: 401, statusText: "Unauthorized" })

}