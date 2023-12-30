import React from 'react';
import { FaBook, FaBookReader, FaUsers, FaUserPlus } from 'react-icons/fa';
import { GrProjects } from "react-icons/gr";
import { MdGroups2 } from "react-icons/md";
import { Card } from './Card';

export function CardList() {
    const cardData = [
        {
            title: "Total Projects",
            count: 150,
            colors: "success",
            icon: <GrProjects />
        },
        {
            title: "Total Employees",
            count: 30,
            colors: "warning",
            icon: <MdGroups2 />
        },
        {
            title: "Total Clients",
            count: 350,
            colors: "info",
            icon: <FaUsers />
        },
        {
            title: "NEW Employees",
            count: "58",
            colors: "primary",
            icon: <FaUserPlus />
        }
    ];

    return (
        <div className='row' >
            {cardData.map((dt, index) => <Card key={index} data={dt} />)}
        </div>
    );
}