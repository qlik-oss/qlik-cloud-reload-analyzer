# Qlik Cloud Reload Analyzer

> **Warning**
> This application is _community supported_. This means that you should not contact
> Qlik Support for help with this app. See below for additional information
> on how to raise issues on this repository to ask for help.

The Reload Analyzer is a Qlik Sense application built for Qlik Cloud, which
provides an overview of data refreshes for your Qlik Cloud tenant.

![Sheets in the Reload Analyzer](/images/readme_reload_sheets.png)

It provides information such as:

* The number of reloads by type (Scheduled, Hub, In App, API) and by user
* Data connections and used files of each app’s most recent reload
* Reload concurrency and peak reload RAM
* Reload tasks and their respective statuses

For information on other Qlik Cloud monitoring apps, please
[visit this Qlik Community post](https://community.qlik.com/t5/Official-Support-Articles/The-Qlik-Sense-Monitoring-Applications-for-Cloud-and-On-Premise/ta-p/1822454).

## Contents

* [Installing](#installing)
* [Upgrading](#upgrading)
* [Qlik Cloud Monitoring Apps](#qlik-cloud-monitoring-apps)
* [Support policy](#support-policy)

## Installing

> **Note**
> A PDF containing installation instructions is also provided with each release.

If you are installing for the first time, you will need to:

* Ensure you have a user assigned with the TenantAdmin role
* Ensure you know how to use the Data Load Editor

### 1 Enable API keys for the tenant

Access the tenant _Management Console_ at `https://<yourtenant>.<region>.qlikcloud.com/console`
and navigate to _Settings_.

Scroll down to _API keys_ and ensure that API keys are enabled, and that there
is a reasonable maximum token expiry set.

![Configure API keys](/images/readme_api_keys.png)

The shorter this maximum expiry, the more frequently you'll need to refresh
these credentials to ensure the app continues to reload.

### 2 Enable API keys for your user

Once API keys are enabled at the tenant level, you need to assign your user
the `Developer` role to permit generation of a new key.

![Enable API keys for your user](/images/readme_developer_role.png)

In the _Management Console_, access _Users_, find your user account and select
_Edit roles_. Ensure the `Developer` role is checked, and _Save_.

### 3 Create API key for your user

To create a new API key for your user, click on your profile icon in the top
right of any Qlik Cloud screen, and select _Profile settings_.

![Enter profile settings](/images/readme_your_profile_button.png)

Navigate to _API keys_, and generate a new API key. Make sure you set the correct
expiry, and a descriptive name. Copy the generated key, as it is only shown once.

![Create new API key](/images/readme_new_api_key.png)

Note that this API key can be used for multiple connections to Qlik Cloud, so you
can reuse this key for other Qlik Cloud monitoring apps.

### 4 Import the app

Next, import the app. We recommend that you create a shared space, named
_Monitoring staging_, and once you have configured the app, you publish this to
a managed space for consumption by your users - however, this is beyond the scope
of this guide.

To import the app, navigate to the _Analytics Hub_, select _Add new_, and
_Upload app_.

![Go to the add new menu to upload an app](/images/readme_add_new.png)

In the dialog, select the app to upload and the target space.

![Specify which app to import and the target space](/images/readme_upload_app.png)

Click _Upload_ to import the app.

### 5 Configure the app

Once imported, open the app and navigate to the _Data load editor_.

Click _Create new connection_ and choose the _REST connector_.

Set the _URL_ to `https://<tenant>.<region>.qlikcloud.com/api/v1/items`, replacing
the `<tenant>.<region>` to match the environment to be monitored.
Example: `https://tenantname.us.qlikcloud.com/api/v1/items`

![Configure the url to match the tenant you wish to monitor](/images/readme_rest_url.png)

Scroll down to the _Request parameters_ section, and under _Query Headers_, add
the name `Authorization` and set the value to `Bearer <paste API key here>`.

![Add your API key to the headers section of the connection](/images/readme_rest_auth.png)

Rename the connection name to a friendlier name. `REST for Monitoring Apps` is
a good example name, since the connection can be reused for the other Qlik Cloud
monitoring apps. Click _Create_.

Go to the _Configuration_ script tab and verify the `vu_rest_connection` variable
value matches the name of the REST connection created in the previous step.
If it does not match, update the variable.

> **Note**
> `:REST for Monitoring Apps` uses a relative path which will check for a
> connection in the current space with that name.

![Ensure the connection name matches the one you created](/images/readme_rest_connection.png)

Also verify that the `vu_qvd_storage_connection` variable value is correct. By
default, this stores generated data files into the same space as the app.

Adjust the `vu_tenant_fqdn` variable to the fully qualified domain name (FQDN)
for the tenant. The FQDN is the URL used to access the tenant.
Example: `tenantname.us.qlikcloud.com`

![Ensure you specify the tenant to connect to](/images/readme_rest_fqdn.png)

The app is now ready to reload. Click _Load data_ in the top right-hand corner
to reload the app.

## Troubleshooting

If while reloading the application a 500 (Internal Server Error) is presented,
this is likely due to the fact that the tenant has a large amount of reload data,
and the 90 day range (default) is too large.

![HTTP500 error on reload analyzer](/images/readme_reload_500.png)

1. Navigate to the *OPTIONAL CONFIG* tab.
2. Find the *vu_initial_days_back* variable and adjust it to a smaller range.
   The default is 90, so it must be an integer less than that number. Repeat
   this step until the reload no longer shows the 500 error.
   1. If set to 90 set to 60
   2. If set to 60 set to 30
   3. If set to 30 set to 7
   4. etc

Note that this variable is ignored in the load script following a successful
reload. After a successful reload, the app will begin to build incrementally on
whatever the foundation (*vu_initial_days_back*) was set to. Meaning,
if *vu_initial_days_back* was set to _30_, the app was reloaded successfully, and
then *vu_initial_days_back* was set to _60_, and the app was reloaded successfully
again, the result will not hold 60 days of data, but rather it will hold 30 days
of data with the incremental addition of the time since the last reload. If it
is desired to increase this number, the *reload_analyzer_%* QVDs
would need to first be deleted. Hence, step 2 above shows that it is best to
decrement this variable rather than increment. If chosen to increment, QVDs will
need to be deleted prior to the subsequent reload for the variable to function properly.

## Upgrading

To upgrade the the app to a new version:

* Ensure that the new version is backwards compatible with the existing version
  (refer to the release notes).
* Import the new app to the shared space, and amend variables to match your existing
  app, in particular, `vu_rest_connection`, `vu_qvd_storage_connection`, and
  `vu_tenant_fqdn`.
* Reload the new app to verify it is working correctly.
* Ensure any reload schedules on the old app are transferred to the new app, and
  any published copies of the old app are replaced.

## Qlik Cloud Monitoring Apps

This application is one of a set of community built and supported monitoring apps
for Qlik Cloud.

Monitoring apps:

* <Link to="https://github.com/qlik-oss/qlik-cloud-entitlement-analyzer">Entitlement Analyzer for Qlik Cloud</Link>
* <Link to="https://community.qlik.com/t5/Support-Updates/The-App-Analyzer-for-Qlik-SaaS-customers-is-available-NOW/ba-p/1734927">App Analyzer for Qlik Cloud</Link>
* <Link to="https://community.qlik.com/t5/Support-Updates/The-Reload-Analyzer-for-Qlik-SaaS-customers-is-available-NOW/ba-p/1826163">Reload Analyzer for Qlik Cloud</Link>
* <Link to="https://community.qlik.com/t5/Support-Updates/New-Monitoring-App-for-Qlik-Cloud-Access-Evaluator/ba-p/1954291">Access Evaluator for Qlik Cloud</Link>
* <Link to="https://community.qlik.com/t5/Support-Updates/OEM-Dashboard-Qlik-Cloud-Application-Developed/ba-p/1994719">OEM Dashboard for Qlik Cloud</Link>
* <Link to="https://community.qlik.com/t5/Official-Support-Articles/How-to-automation-monitoring-app-for-tenant-admins-with-Qlik/ta-p/2025392">Qlik Application Automation Monitoring App</Link>

If you are looking for the Qlik Sense Enterprise Client-Managed monitoring apps,
please review <Link to="https://help.qlik.com/en-US/sense-admin/latest/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Administer_QSEoW/Monitoring_QSEoW/Monitor-Qlik-Sense-site.htm">this help page</Link>.

## Support policy

This app is provided as-is and is not supported by Qlik. Over time, the APIs and
metrics used by the app may change, so it is advised to monitor this repository
for updates, and to update the app promptly when new versions are available.

If you have issues while using this app, support is provided on a best-efforts
basis by contributors to this project.

If you have an issue:

* Review the FAQ section in this readme to see if your issue is a common one
* Review open and closed [issues](/issues)
* Open a [new issue](/issues/new), following the issue template

If you are able to resolve the issue, then close your issue with the resolution,
and if you feel inclined, open a PR with your proposed changes so that we can
consider including the improvement in the next release of the app.

Thank you for your support!
