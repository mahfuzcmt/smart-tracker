package com.bitsoft.smarttracking.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.appcompat.widget.AppCompatImageView;

import com.bitsoft.smarttracking.R;
import com.bitsoft.smarttracking.model.LocModel;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

public class LocAdapter extends ArrayAdapter<LocModel> {

    Context myContext;
    ArrayList<LocModel> dataList;
    LayoutInflater inflater;

    public  LocAdapter(Context context, ArrayList<LocModel> dataList) {
        super(context,  R.layout.single_loc_layout, dataList);
        this.myContext = context;
        this.inflater= LayoutInflater.from(myContext);
        this.dataList = dataList;

    }

    @Override
    public int getCount() {
        return dataList.size();
    }

    @Override
    public LocModel getItem(int position) {
        return dataList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    private class ViewHolder {
        private AppCompatImageView userPhoto;
        private TextView txtFullName;
        private TextView txtDesignation;
        private TextView txtMobile;
        private TextView txtBattery;
        private TextView txtLatLng;
        private TextView txtAddress;
        private TextView txtDatetime;

    }

    private int lastPosition = -1;
    public View getView(final int position, View convertView, ViewGroup parent) {
        final LocModel dataModel =  getItem(position);
        final LocAdapter.ViewHolder viewHolder;
        if (convertView == null) {
            viewHolder = new LocAdapter.ViewHolder();
            LayoutInflater inflater = LayoutInflater.from(getContext());
            convertView = inflater.inflate(R.layout.single_loc_layout, null);
            viewHolder.userPhoto = convertView.findViewById(R.id.user_photo);
            viewHolder.txtFullName = convertView.findViewById(R.id.user_name);
            viewHolder.txtDesignation = convertView.findViewById(R.id.user_desg);
            viewHolder.txtMobile = convertView.findViewById(R.id.user_mobile);
            viewHolder.txtBattery = convertView.findViewById(R.id.mobile_charge);
            viewHolder.txtAddress = convertView.findViewById(R.id.user_address);
            viewHolder.txtDatetime = convertView.findViewById(R.id.loc_time);
            viewHolder.txtLatLng = convertView.findViewById(R.id.user_lat_lng);
            convertView.setTag(viewHolder);

        } else {
            viewHolder = (LocAdapter.ViewHolder)  convertView.getTag();
        }
        lastPosition = position;
        Picasso.get()
                .load(dataModel.getImagePath())
                .placeholder(R.mipmap.ic_blank_photo)
                .resize(60,60)
                .error(R.mipmap.ic_blank_photo)
                .into(viewHolder.userPhoto);
        viewHolder.txtFullName.setText(dataModel.getFullName());
        viewHolder.txtDesignation.setText(dataModel.getDesignation());
        viewHolder.txtBattery.setText("Charge: "+dataModel.getCharge());
        viewHolder.txtMobile.setText("Mobile: "+dataModel.getContactNo());
        viewHolder.txtLatLng.setText("LatLng: ("+dataModel.getLat()+","+dataModel.getLng()+")");
        viewHolder.txtAddress.setText("Address: "+dataModel.getAddress());
        viewHolder.txtDatetime.setText("Created At "+dataModel.getCreated());
        return convertView;
    }
}
