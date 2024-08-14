package com.mobilekeychain;

import android.app.ActivityManager;
import android.content.Context;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class Utils {
    /**
     * Returns a number with commas
     * @param value - the number as string
     * @return the number as string with 2 decimals, i.e: '12,000.00'
     */
    public static String withCommas(String value){
        double amount = Double.parseDouble(value);
        if(amount == 0) return "0";
        DecimalFormat formatter = new DecimalFormat("###,###.##");
        return formatter.format(amount);
    }

    public static String toLocaleCurrency(Double amount){
        Locale locale = new Locale("en", "US");
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(locale);
        return currencyFormatter.format(amount);
    }

    public static Double toHp(JSONObject extended_account, JSONObject dynamic_global_properties) {
        Double defaultHp = 0.0;
        if (dynamic_global_properties == null) return defaultHp;
        Double total_vesting_fund_hive = 0.0;
        Double total_vesting_shares = 0.0;
        Double hive_power = 0.0;
        Double vesting_shares_account = 0.0;
        try {
            String totalVestingFundHive = dynamic_global_properties.getString("total_vesting_fund_hive").split("\\s")[0];
            String totalVestingShares = dynamic_global_properties.getString("total_vesting_shares").split("\\s")[0];
            String vestingSharesAccount = extended_account.getString("vesting_shares").split("\\s")[0];
            total_vesting_fund_hive = new Double(totalVestingFundHive);
            total_vesting_shares = new Double(totalVestingShares);
            vesting_shares_account = new Double(vestingSharesAccount);
            hive_power = (vesting_shares_account * total_vesting_fund_hive) / total_vesting_shares;
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("Utils.toHp error:", e.getLocalizedMessage());
            return defaultHp;
        }
        return hive_power;
    }

    public static String getAccountValue(JSONObject extended_account,JSONObject currency_data, JSONObject dynamic_global_properties){
        Double default_account_value = 0.0;
        JSONObject hive_dollar = null;
        JSONObject hive = null;
        Double account_value = null;
        try {
            hive_dollar = currency_data.getJSONObject("hive_dollar");
            hive = currency_data.getJSONObject("hive");
            if (!hive_dollar.has("usd") || !hive.has("usd") || dynamic_global_properties == null){
                return toLocaleCurrency(default_account_value);
            }else{
                String hbdBalance = extended_account.getString("hbd_balance").split("\\s")[0];
                String savingsHbdBalance = extended_account.getString("savings_hbd_balance").split("\\s")[0];
                String balanceString = extended_account.getString("balance").split("\\s")[0];
                String savingsBalance = extended_account.getString("savings_balance").split("\\s")[0];
                Double hive_dollar_usd = hive_dollar.getDouble("usd");
                Double hive_usd = hive.getDouble("usd");
                Double hbd_balance = new Double(hbdBalance);
                Double savings_hbd_balance = new Double(savingsHbdBalance);
                Double balance = new Double(balanceString);
                Double savings_balance = new Double(savingsBalance);
                account_value = ((hbd_balance + savings_hbd_balance) * hive_dollar_usd) + ((toHp(extended_account, dynamic_global_properties) + balance + savings_balance) * hive_usd);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("Error getAccountValue", e.getLocalizedMessage());
            return toLocaleCurrency(default_account_value);
        }
        return toLocaleCurrency(account_value);
    }

    public static boolean isAppRunning(final Context context, final String packageName) {
        final ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        final List<ActivityManager.RunningAppProcessInfo> procInfos = activityManager.getRunningAppProcesses();
        if (procInfos != null)
        {
            for (final ActivityManager.RunningAppProcessInfo processInfo : procInfos) {
                if (processInfo.processName.equals(packageName)) {
                    return true;
                }
            }
        }
        return false;
    }
}
