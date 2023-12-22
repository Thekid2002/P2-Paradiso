import { queryThis } from '../models/db.js';
import { setupCompanyTable, setupUserCompanyTable } from '../models/company.js';
import { setupUsersTable } from '../models/user.js';
import { setupUsersEventsTable } from '../services/participation.js';
import { setupCompaniesEventsTable, setupEventTable } from '../models/event.js';
import { createScheduleTable } from '../models/schedule.js';
import { setupVenuesTable } from '../models/venue.js';
import { setupCateringTable } from '../models/catering.js';
import { setupEntertainmentTable } from '../models/entertainment.js';
import { setupEventsVenueCateringEntertainmentTable } from '../models/venueCateringEntertainment.js';

export { setupDatabases };

/**
 * Setting up all databases currently in the project
 */
async function setupDatabases() {
    //await dropDatabase();
    await createDatabase();
    await setupEventTable();
    await setupCompanyTable();
    await setupUsersTable();
    await setupUsersEventsTable();
    await setupUserCompanyTable();
    await setupCompaniesEventsTable();
    await createScheduleTable();
    await setupVenuesTable();
    await setupCateringTable();
    await setupEntertainmentTable();
    await setupEventsVenueCateringEntertainmentTable();
}

/**
 * Creates the EVENTILOPE database
 */
async function createDatabase() {
    try {
        console.log('Creating database');
        const sql = 'CREATE DATABASE IF NOT EXISTS EVENTILOPE';
        await queryThis(sql);
    } catch (e) {
        console.log(e);
        return false;
    }
    console.log('Database created');
}

/**
 * Deletes the EVENTILOPE database
 * If this function is run all data in the database will be lost.
 */
async function dropDatabase() {
    console.log('');
    console.error('==>DELETING DATABASE IS ON, THE DATABASE IS DROPPED ON EVERY RUN!<==');
    console.log('');
    try {
        console.log('Deleting database');
        const sql = 'DROP DATABASE EVENTILOPE';
        try {
            await queryThis(sql);
        } catch (e) {
            console.error(e);
            return false;
        }
        console.log('Database deleted');
    } catch (e) {
        console.error(e);
    }
}