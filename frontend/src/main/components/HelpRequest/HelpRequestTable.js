import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function HelpRequestTable({ helpRequests, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/helprequest/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        (cell) => ({
            url: "/api/helprequest",
            method: "DELETE",
            params: {
                id: cell.row.values.id
            }
        }),
        { onSuccess: onDeleteSuccess },
        ["/api/helprequest/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'requesterEmail',
            accessor: 'requesterEmail',
        },
        {
            Header: 'teamId',
            accessor: 'teamId',
        },
        {
            Header: 'tableOrBreakoutRoom',
            accessor: 'tableOrBreakoutRoom',
        },
        {
            Header: 'requestTime',
            accessor: 'requestTime',
        },
        {
            Header: 'explanation',
            accessor: 'explanation',
        },
        {
            Header: 'solved',
            accessor: (row, _rowIndex) => row.solved ? 'true' : 'false',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "HelpRequestTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestTable"));
    } 

    return <OurTable
        data={helpRequests}
        columns={columns}
        testid={"HelpRequestTable"}
    />;
};