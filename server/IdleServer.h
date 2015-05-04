#ifndef _IdleServer_H_
#define _IdleServer_H_

#pragma warning(disable:4996)
#define _WEBSOCKETPP_CPP11_THREAD_
#define _WEBSOCKETPP_CPP11_FUNCTIONAL_
#define _WEBSOCKETPP_CPP11_SYSTEM_ERROR_
#define _WEBSOCKETPP_CPP11_RANDOM_DEVICE_
#define _WEBSOCKETPP_CPP11_MEMORY_
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <websocketpp/processors/processor.hpp>
#include <websocketpp/http/request.hpp>
#pragma warning(default:4996)
#include <json/json.h>

#include <iostream>
#include <sstream>
#include <map>

// recv packets
#define PACKET_DONUT "donut"
#define PACKET_UPG1 "upg1"
#define PACKET_UPG2 "upg2"
#define PACKET_UPG3 "upg3"
#define PACKET_UPG4 "upg4"
#define PACKET_UPG5 "upg5"

// send packets
#define PACKET_INIT "init"
#define PACKET_VALUES "values"
#define PACKET_SCORE "score"
#define PACKET_UPG1_STATUS "upg1_status"
#define PACKET_UPG2_STATUS "upg2_status"
#define PACKET_UPG3_STATUS "upg3_status"
#define PACKET_UPG4_STATUS "upg4_status"
#define PACKET_UPG5_STATUS "upg5_status"

// game constants
#define UPG_COST_SCALE 5
#define UPG_CPS_SCALE 7
#define UPG_EXP 0.006
#define UPG1_COST 10
#define UPG1_CPS 1
#define UPG2_COST UPG1_COST * UPG_COST_SCALE
#define UPG2_CPS UPG1_CPS * UPG_CPS_SCALE
#define UPG3_COST UPG2_COST * UPG_COST_SCALE
#define UPG3_CPS UPG2_CPS * UPG_CPS_SCALE
#define UPG4_COST UPG3_COST * UPG_COST_SCALE
#define UPG4_CPS UPG3_CPS * UPG_CPS_SCALE
#define UPG5_COST UPG4_COST * UPG_COST_SCALE
#define UPG5_CPS UPG4_CPS * UPG_CPS_SCALE

struct connection_data {
	connection_data() {
		this->session_id = 0;
		this->currency = 0.0;
		this->mod_add = 0.0;
		this->mod_mult = 1.0;
		this->total = 0.0;
		this->upg1_count = 0;
		this->upg1_cost = UPG1_COST;
		this->upg2_count = 0;
		this->upg2_cost = UPG2_COST;
		this->upg3_count = 0;
		this->upg3_cost = UPG3_COST;
		this->upg4_count = 0;
		this->upg4_cost = UPG4_COST;
		this->upg5_count = 0;
		this->upg5_cost = UPG5_COST;
		this->name = "default";
	}
	int session_id;
	std::string name;
	double currency;
	double mod_add;
	double mod_mult;
	double total;

	int upg1_count;
	double upg1_cost;
	int upg2_count;
	double upg2_cost;
	int upg3_count;
	double upg3_cost;
	int upg4_count;
	double upg4_cost;
	int upg5_count;
	double upg5_cost;
};

class IdleServer {
public:
	IdleServer();
	~IdleServer() { };

	void on_open(websocketpp::connection_hdl hdl);
	void on_close(websocketpp::connection_hdl hdl);
	void on_message(websocketpp::connection_hdl hdl, websocketpp::server<websocketpp::config::asio>::message_ptr msg);
	//websocketpp::lib::shared_ptr<boost::asio::ssl::context> on_tls(websocketpp::connection_hdl hdl);
	void tick(const websocketpp::lib::error_code& ec);
	void run(uint16_t port);

private:
	void send_status(websocketpp::connection_hdl hdl, std::string target, std::string count, std::string cost, bool status);
	void send_values(websocketpp::connection_hdl hdl, std::string currency, std::string cps, std::string total);
	connection_data& get_data_from_hdl(websocketpp::connection_hdl hdl);

	websocketpp::server<websocketpp::config::asio> _server;

	std::map<websocketpp::connection_hdl, connection_data, std::owner_less<websocketpp::connection_hdl>> _connections;
	std::mutex _mutex;
	websocketpp::server<websocketpp::config::asio>::timer_ptr _timer;
	int _next_id;
};

#endif