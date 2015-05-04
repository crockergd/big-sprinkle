#include "IdleServer.h"

IdleServer::IdleServer() {
	// Mutes loggers
	_server.clear_access_channels(websocketpp::log::alevel::all);
	_server.clear_error_channels(websocketpp::log::elevel::all);
	
	_server.init_asio();
	_server.set_open_handler(bind(&IdleServer::on_open, this, _1));
	_server.set_close_handler(bind(&IdleServer::on_close, this, _1));
	_server.set_message_handler(bind(&IdleServer::on_message, this, _1, _2));
	//_server.set_tls_init_handler(bind(&IdleServer::on_tls, this, _1));
	_timer = _server.set_timer(1000, bind(&IdleServer::tick, this, _1));
	_next_id = 0;
}

void IdleServer::on_open(websocketpp::connection_hdl hdl){
	std::cout << "Client connected" << std::endl;
	std::lock_guard<std::mutex> lock(_mutex);

	connection_data data;
	data.session_id = _next_id++;
	data.name = "User " + std::to_string(data.session_id);
	_connections[hdl] = data;

	Json::Value root;
	Json::StyledWriter writer;
	root["type"] = PACKET_INIT;
	root["upg1_cost"] = UPG1_COST;
	root["upg1_cps"] = UPG1_CPS;
	root["upg2_cost"] = UPG2_COST;
	root["upg2_cps"] = UPG2_CPS;
	root["upg3_cost"] = UPG3_COST;
	root["upg3_cps"] = UPG3_CPS;
	root["upg4_cost"] = UPG4_COST;
	root["upg4_cps"] = UPG4_CPS;
	root["upg5_cost"] = UPG5_COST;
	root["upg5_cps"] = UPG5_CPS;
	std::string msg = writer.write(root);
	_server.send(hdl, msg, websocketpp::frame::opcode::text);
}

void IdleServer::on_close(websocketpp::connection_hdl hdl){
	std::cout << "Client disconnected" << std::endl;
	std::lock_guard<std::mutex> lock(_mutex);

	connection_data& data = get_data_from_hdl(hdl);
	std::cout << "Closing connection with session " << data.session_id << std::endl;

	_connections.erase(hdl);
}

void IdleServer::on_message(websocketpp::connection_hdl hdl, websocketpp::server<websocketpp::config::asio>::message_ptr msg) {
	Json::Value root;
	Json::Reader reader;
	if (!reader.parse(msg->get_payload(), root)) {
		std::cout << "Failed to parse message" << std::endl;
		return;
	}

	std::string type = root.get("type", "").asString();
	if (type != "") {
		connection_data& data = get_data_from_hdl(hdl);
		if (type == PACKET_DONUT) {
			data.currency += 1.0;
			data.total += 1.0;
		}
		else if (type == PACKET_UPG1) {
			if ((data.currency - data.upg1_cost) >= 0.0) {
				data.currency -= data.upg1_cost;
				data.mod_add += UPG1_CPS;
				data.upg1_count++;
				data.upg1_cost *= (1.0 + (UPG_EXP * data.upg1_count));
				send_status(hdl, PACKET_UPG1_STATUS, std::to_string(data.upg1_count), std::to_string(data.upg1_cost), true);
			}
			else {
				send_status(hdl, PACKET_UPG1_STATUS, std::to_string(data.upg1_count), std::to_string(data.upg1_cost), false);
			}
		}
		else if (type == PACKET_UPG2) {
			if ((data.currency - data.upg2_cost) >= 0.0) {
				data.currency -= data.upg2_cost;
				data.mod_add += UPG2_CPS;
				data.upg2_count++;
				data.upg2_cost *= (1.0 + (UPG_EXP * data.upg2_count));
				send_status(hdl, PACKET_UPG2_STATUS, std::to_string(data.upg2_count), std::to_string(data.upg2_cost), true);
			}
			else {
				send_status(hdl, PACKET_UPG2_STATUS, std::to_string(data.upg2_count), std::to_string(data.upg2_cost), false);
			}
		}
		else if (type == PACKET_UPG3) {
			if ((data.currency - data.upg3_cost) >= 0.0) {
				data.currency -= data.upg3_cost;
				data.mod_add += UPG3_CPS;
				data.upg3_count++;
				data.upg3_cost *= (1.0 + (UPG_EXP * data.upg3_count));
				send_status(hdl, PACKET_UPG3_STATUS, std::to_string(data.upg3_count), std::to_string(data.upg3_cost), true);
			}
			else {
				send_status(hdl, PACKET_UPG3_STATUS, std::to_string(data.upg3_count), std::to_string(data.upg3_cost), false);
			}
		}
		else if (type == PACKET_UPG4) {
			if ((data.currency - data.upg4_cost) >= 0.0) {
				data.currency -= data.upg4_cost;
				data.mod_add += UPG4_CPS;
				data.upg4_count++;
				data.upg4_cost *= (1.0 + (UPG_EXP * data.upg4_count));
				send_status(hdl, PACKET_UPG4_STATUS, std::to_string(data.upg4_count), std::to_string(data.upg4_cost), true);
			}
			else {
				send_status(hdl, PACKET_UPG4_STATUS, std::to_string(data.upg4_count), std::to_string(data.upg4_cost), false);
			}
		}
		else if (type == PACKET_UPG5) {
			if ((data.currency - data.upg5_cost) >= 0.0) {
				data.currency -= data.upg5_cost;
				data.mod_add += UPG5_CPS;
				data.upg5_count++;
				data.upg5_cost *= (1.0 + (UPG_EXP * data.upg5_count));
				send_status(hdl, PACKET_UPG5_STATUS, std::to_string(data.upg5_count), std::to_string(data.upg5_cost), true);
			}
			else {
				send_status(hdl, PACKET_UPG5_STATUS, std::to_string(data.upg5_count), std::to_string(data.upg5_cost), false);
			}
		}
		else if (type == PACKET_SCORE) {
			std::string currency_total = std::to_string(int(data.total));
			std::string content_length = std::to_string(currency_total.size() + data.name.size() + 14);

			boost::asio::ip::tcp::iostream stream;
			stream.expires_from_now(boost::posix_time::seconds(60));
			//stream.connect("radbee.me", "80");
			stream.connect("localhost", "5656");
			stream << "POST /scores HTTP/1.0\r\n";
			stream << "From: DonutServer\r\n";
			stream << "User-Agent: HTTPTool/1.0\r\n";
			stream << "Content-Type: application/x-www-form-urlencoded\r\n";
			stream << "Content-Length: " + content_length + "\r\n\r\n";
			stream << "client=" + data.name + "&score=" + std::to_string(data.total);
			stream << "Connection: close\r\n\r\n";

			stream.flush();
			std::stringstream ss;
			ss << stream.rdbuf(); // doesn't work if you don't do this
		}

		send_values(hdl, std::to_string(data.currency), std::to_string(data.mod_add), std::to_string(data.total));
	}
}

void IdleServer::tick(const websocketpp::lib::error_code& ec) {
	for (auto it = _connections.begin(); it != _connections.end(); ++it) {
		it->second.currency += it->second.mod_add;
		it->second.currency *= it->second.mod_mult;
		it->second.total += it->second.mod_add;
		it->second.total *= it->second.mod_mult;
		send_values(it->first, std::to_string(it->second.currency), std::to_string(it->second.mod_add), std::to_string(it->second.total));
	}
	_timer = _server.set_timer(1000, bind(&IdleServer::tick, this, _1));
}

void IdleServer::run(uint16_t port){
	_server.listen(port);
	_server.start_accept();
	std::cout << "Server started" << std::endl;
	_server.run();
}

connection_data& IdleServer::get_data_from_hdl(websocketpp::connection_hdl hdl) {
	auto it = _connections.find(hdl);

	if (it == _connections.end()) {
		std::cout << "Unable to find connection" << std::endl;
	}

	return it->second;
}

void IdleServer::send_status(websocketpp::connection_hdl hdl, std::string target, std::string count, std::string cost, bool status) {
	Json::Value root;
	Json::StyledWriter writer;
	root["type"] = target;
	root["count"] = count;
	root["cost"] = cost;
	root["status"] = status;
	std::string msg = writer.write(root);
	_server.send(hdl, msg, websocketpp::frame::opcode::text);
}

void IdleServer::send_values(websocketpp::connection_hdl hdl, std::string currency, std::string cps, std::string total) {
	Json::Value root;
	Json::StyledWriter writer;
	root["type"] = PACKET_VALUES;
	root["currency"] = currency;
	root["cps"] = cps;
	root["total"] = total;
	std::string msg = writer.write(root);
	_server.send(hdl, msg, websocketpp::frame::opcode::text);
}

/*websocketpp::lib::shared_ptr<boost::asio::ssl::context> IdleServer::on_tls(websocketpp::connection_hdl hdl) {
	std::cout << "on_tls_init called with hdl: " << hdl.lock().get() << std::endl;
	websocketpp::lib::shared_ptr<boost::asio::ssl::context> ctx = websocketpp::lib::make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv1_server);

	try {
		ctx->set_options(boost::asio::ssl::context::default_workarounds |
			boost::asio::ssl::context::no_sslv2 |
			boost::asio::ssl::context::no_sslv3 |
			boost::asio::ssl::context::single_dh_use);
		ctx->use_certificate_chain_file("ssl-bundle.crt");
		ctx->use_private_key_file("myserver.key", boost::asio::ssl::context::pem);
		ctx->load_verify_file("myserver.key");
	}
	catch (std::exception& e) {
		std::cout << e.what() << std::endl;
	}
	return ctx;
}*/