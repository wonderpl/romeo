if [ $1 -gt 0 ]; then
	# upgrade
	/sbin/service %{name} reload >/dev/null || :
fi
