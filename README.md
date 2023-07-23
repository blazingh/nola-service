# NOLA
A **no other language authentication** service


## Who can access the service ?

- Anonymous users
- Authenticated users
- Admin users

#### Anonymous Users
these users can interact with the following routes without needing any **Bearer token**

- /auth/signup
- /auth/login

#### Authenticated Users
these users are required to have a valid **Bearer token** to be able to interact with the following routes

- /auth/logout
- /auth/send-reset-password

#### Admin Users
these users must have a valid **Bearer token** and an **ADMIN_ROLE** included in the token
the ADMIN_ROLE can be set in the .env file

- /admin/user
- /admin/user/:id
- /admin/group-user
- /admin/group-user/:id
- /admin/setting
- /admin/setting/:name
- /admin/setting/:id


## App Authentication Settings

Below are the settings related to user authentication and login options in the app. These settings help determine the allowed login methods, security measures, and user access options. the settings are stored in the database as **setting_entity**

#### Setting 1: DISABLE_EMAIL_LOGIN

-   Description: Disables the option for users to log in using their email addresses.
-   Default Value: False (Email login is enabled by default)

#### Setting 2: DISABLE_PHONE_LOGIN

-   Description: Disables the option for users to log in using their phone numbers.
-   Default Value: False (Phone login is enabled by default)

#### Setting 3: ALLOW_INACTIVE_USER_LOGIN

-   Description: Allows inactive users (users with deactivated accounts) to log in to the app.
-   Default Value: False (Inactive user login is disabled by default)

#### Setting 4: ALLOW_UNVERIFIED_PHONE_LOGIN

-   Description: Allows users with unverified phone numbers to log in to the app.
-   Default Value: False (Unverified phone login is disabled by default)

#### Setting 5: ALLOW_UNVERIFIED_EMAIL_LOGIN

-   Description: Allows users with unverified email addresses to log in to the app.
-   Default Value: False (Unverified email login is disabled by default)

#### Setting 6: ALLOW_EMAIL_TWO_FACTOR_AUTH

-   Description: Allows users to enable two-factor authentication (2FA) via email for added security during login.
-   Default Value: False (Email 2FA is disabled by default)

#### Setting 7: ALLOW_PHONE_TWO_FACTOR_AUTH

-   Description: Allows users to enable two-factor authentication (2FA) via phone number for added security during login.
-   Default Value: False (Phone 2FA is disabled by default)