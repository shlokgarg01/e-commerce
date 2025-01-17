/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../layout/MetaData";
import Loader from "../../layout/Loader/Loader";
import { clearErrors, getUserAddresses } from "../../../actions/userAction";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { getDateTimeFromDateString } from "../../../helpers/DateHelper";

export default function UserAddresses() {
    const dispatch = useDispatch();
    const userId = useParams().id;
    const alert = useAlert();
    const { error, addresses, loading } = useSelector((state) => state.userAddresses);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(getUserAddresses(userId));
    }, [dispatch, userId, alert]);

    return (
        <Fragment>
            <MetaData title="User Address" />
            {
                loading ? <Loader /> : (
                    <div className="row m-3">
                        <div className="col">
                            <div className="card">
                                <h5 className="card-header text-center">User Addresses</h5>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-responsive">
                                            <thead>
                                                <tr>
                                                    <th scope="col">S.No</th>
                                                    <th scope="col">Label</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Pincode</th>
                                                    <th scope="col">Created On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {addresses?.length === 0 ? (
                                                    <tr>
                                                        <td className="text-center fw-bold" colSpan={9}>No Addresses Yet</td>
                                                    </tr>
                                                ) : addresses?.sort((a, b) => (a.label === 'Home' ? -1 : b.label === 'Home' ? 1 : 0)).map((address, index) => (
                                                    <tr key={index} className="align-middle">
                                                        <th scope="row">{index + 1}.</th>
                                                        <td>{address.label}</td>
                                                        <td>{address.address}</td>
                                                        <td>{address.pincode}</td>
                                                        <td>{getDateTimeFromDateString(address.createdAt)}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </Fragment>
    )
}
